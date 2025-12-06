const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Payment = require("./models/Payment");
const Event = require("./models/Event");
const Admin = require("./models/Admin");
const PageContent = require("./models/PageContent");
const Ticket = require("./models/Ticket");
const SystemSettings = require("./models/SystemSettings");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
// 1. CONNECT MONGO DB
// -------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    // Auto-seed Admin
    try {
      const existingAdmin = await Admin.findOne({ username: "admin" });
      if (!existingAdmin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);
        await Admin.create({ username: "admin", password: hashedPassword });
        console.log("👤 Default Admin Created (admin/admin123)");
      }
    } catch (err) {
      console.error("Failed to seed admin:", err);
    }
  })
  .catch((err) => console.log("❌ DB Error", err));

// -------------------------------
// 2. Razorpay Instance
// -------------------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------------------------------
// 3. ADMIN AUTH
// -------------------------------
app.post("/admin/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ success: false, message: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ username, password: hashedPassword });
    res.json({ success: true, message: "Admin created" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating admin" });
  }
});

app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// -------------------------------
// 4. Create Order
// -------------------------------
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Convert ₹ to paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// -------------------------------
// 5. Verify Payment
// -------------------------------
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      brandName,
      email,
      contact,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // 1. Check if this is a TICKET payment or MEMBERSHIP payment
      // If dbTicketId is present, it is STRICTLY an Event Ticket payment.
      if (req.body.dbTicketId) {
        // --- EVENT TICKET LOGIC ---
        // Verify payment for a specific ticket
        // The "dbTicketId" passed here is the MongoDB _id of the pending ticket.
        // BUT for events, we might pass the DB Ticket ID.
        // Let's clarify: The User requested flow:
        // 1. Create Ticket (PENDING) -> Get DB Ticket ID
        // 2. Pay -> Redirect
        // 3. Verify -> We need to update that DB Ticket to PAID.

        // So here, req.body should contain the DB Ticket _id presumably, or we find it via order_id if we saved it?
        // Simpler: Client sends the DB Ticket _id in the verify request.

        const dbTicketId = req.body.dbTicketId;
        if (dbTicketId) {
          await Ticket.findByIdAndUpdate(dbTicketId, {
            status: "PAID",
            paymentId: razorpay_payment_id,
            signature: razorpay_signature
          });
          // Increment Event Registration Count
          const ticket = await Ticket.findById(dbTicketId);
          await Event.findByIdAndUpdate(ticket.eventId, { $inc: { currentRegistrations: ticket.quantity } });
        }
      } else {
        // --- MEMBERSHIP LOGIC (Existing) ---
        await Payment.create({
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          amount: 500,
          status: "success",
          name,
          brandName,
          email,
          contact,
        });
      }

      res.json({ success: true, message: "Payment verified and saved" });
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// -------------------------------
// 6. Validate User
// -------------------------------
app.post("/validate-user", async (req, res) => {
  try {
    const { email, contact } = req.body;

    // Check if user with same email or contact already has a successful payment
    const existingUser = await Payment.findOne({
      $or: [{ email }, { contact }],
      status: "success"
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.json({ exists: true, message: "Email already registered with a successful payment." });
      }
      if (existingUser.contact === contact) {
        return res.json({ exists: true, message: "Contact number already registered with a successful payment." });
      }
    }

    res.json({ exists: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Validation failed" });
  }
});

// -------------------------------
// 7. Get Members (Protected)
// -------------------------------
app.get("/members", authMiddleware, async (req, res) => {
  try {
    const members = await Payment.find({ status: "success" }).sort({ createdAt: -1 });
    res.json({ success: true, members });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch members" });
  }
});

// -------------------------------
// 7. Dashboard Stats (Protected)
// -------------------------------
// -------------------------------
// 7. Dashboard Stats (Protected)
// -------------------------------
app.get("/admin/stats", authMiddleware, async (req, res) => {
  try {
    // 1. Counts
    const communityCount = await Payment.countDocuments({ status: "success" });
    const eventRegCount = await Ticket.countDocuments({ status: "PAID" });
    const eventCount = await Event.countDocuments();

    // 2. Revenue Calculation
    const communityRevenue = communityCount * 500;

    const eventTickets = await Ticket.find({ status: "PAID" }).select("amount");
    const eventRevenue = eventTickets.reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalRevenue = communityRevenue + eventRevenue;

    // 3. Recent Activity (Merged)
    const recentCommunity = await Payment.find({ status: "success" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .then(docs => docs.map(d => ({ ...d, type: "COMMUNITY", title: "Membership" })));

    const recentEvents = await Ticket.find({ status: "PAID" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("eventId", "title")
      .lean()
      .then(docs => docs.map(d => ({
        ...d,
        type: "EVENT",
        title: d.eventId?.title || "Event",
        brandName: "Event Attendee" // Fallback as tickets might not have brandName
      })));

    // Merge and sort recent
    const recentActivity = [...recentCommunity, ...recentEvents]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // 4. Growth/Revenue Analytics (Last 6 Months)
    // We will simple stats for now, can be expanded
    const monthlyStats = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: 500 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }
    ]);

    const growthData = monthlyStats.map(item => {
      const date = new Date(item._id.year, item._id.month - 1);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        members: item.count,
        revenue: item.revenue
      };
    });

    res.json({
      success: true,
      stats: {
        communityCount,
        eventRegCount,
        totalRevenue,
        activeEvents: eventCount, // Kept for backward compatibility if needed
        recentActivity,
        growthData
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// -------------------------------
// 7.5 Unified Payments API (Admin)
// -------------------------------
app.get("/admin/payments", authMiddleware, async (req, res) => {
  try {
    const community = await Payment.find({ status: "success" }).sort({ createdAt: -1 }).lean();
    const tickets = await Ticket.find({ status: "PAID" }).populate("eventId", "title").sort({ createdAt: -1 }).lean();

    const formattedCommunity = community.map(p => ({
      id: p._id,
      paymentId: p.paymentId,
      name: p.name,
      email: p.email,
      contact: p.contact,
      amount: p.amount || 500,
      date: p.createdAt,
      type: "Membership",
      source: "Community"
    }));

    const formattedTickets = tickets.map(t => ({
      id: t._id,
      paymentId: t.paymentId,
      name: t.name,
      email: t.email,
      contact: t.contact,
      amount: t.amount,
      date: t.createdAt,
      type: t.ticketType || "Ticket",
      source: t.eventId?.title || "Event"
    }));

    const allPayments = [...formattedCommunity, ...formattedTickets].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, payments: allPayments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
});

// -------------------------------
// 8. Events API
// -------------------------------

// Get All Events (Public)
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, events });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
});

// Get Single Event (Public)
app.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch event" });
  }
});

// Register for Event (Create Pending Ticket)
app.post("/events/:id/register", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contact, ticketType, quantity, amount } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Check Capacity
    if (event.currentRegistrations + quantity > event.maxRegistrations) {
      return res.status(400).json({ success: false, message: "Registration Full" });
    }

    const ticket = await Ticket.create({
      eventId: id,
      name,
      email,
      contact,
      ticketType,
      quantity,
      amount,
      status: "PENDING"
    });

    res.json({ success: true, ticketId: ticket._id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// Get Ticket Details
app.get("/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("eventId");
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch ticket" });
  }
});

// Create Event (Protected)
app.post("/events", authMiddleware, async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.json({ success: true, event: newEvent });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to create event" });
  }
});

// Update Event (Protected)
app.put("/events/:id", authMiddleware, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, event: updatedEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
});

// Delete Event (Protected)
app.delete("/events/:id", authMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
});

// -------------------------------
// 9. Page Content API (Protected)
// -------------------------------
app.get("/content/:section", async (req, res) => {
  try {
    const content = await PageContent.findOne({ section: req.params.section });
    res.json({ success: true, content: content ? content.content : null });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch content" });
  }
});

app.post("/content/:section", authMiddleware, async (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;
    const updatedContent = await PageContent.findOneAndUpdate(
      { section },
      { content },
      { new: true, upsert: true }
    );
    res.json({ success: true, content: updatedContent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update content" });
  }
});

// -------------------------------
// 10. System Settings (Maintenance)
// -------------------------------
app.get("/settings/status", async (req, res) => {
  try {
    let settings = await SystemSettings.findOne({ key: "global" });
    if (!settings) {
      settings = await SystemSettings.create({ key: "global" });
    }
    res.json({ success: true, isMaintenanceMode: settings.isMaintenanceMode, message: settings.maintenanceMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
});

app.post("/admin/settings/maintenance", authMiddleware, async (req, res) => {
  try {
    const { isMaintenanceMode } = req.body;
    let settings = await SystemSettings.findOne({ key: "global" });
    if (!settings) {
      settings = await SystemSettings.create({ key: "global", isMaintenanceMode });
    } else {
      settings.isMaintenanceMode = isMaintenanceMode;
      await settings.save();
    }
    res.json({ success: true, isMaintenanceMode: settings.isMaintenanceMode });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update settings" });
  }
});

// -------------------------------
// 11. Event Registrations (Admin)
// -------------------------------
app.get("/admin/registrations", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: "PAID" })
      .populate("eventId", "title date location")
      .sort({ createdAt: -1 });
    res.json({ success: true, registrations: tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch registrations" });
  }
});

// -------------------------------
// 10. Start Server
// -------------------------------
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});