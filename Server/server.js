const express = require("express");
// const Razorpay = require("razorpay");
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
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

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
// -------------------------------
// 4. Create Order (Razorpay - DEPRECATED)
// -------------------------------
// app.post("/create-order", async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const options = {
//       amount: amount * 100, // Convert ₹ to paise
//       currency: "INR",
//       receipt: "rcpt_" + Date.now(),
//     };
//     const order = await razorpay.orders.create(options);
//     res.json({ success: true, order });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, message: "Order creation failed" });
//   }
// });

// -------------------------------
// 5. Verify Payment (Razorpay - DEPRECATED)
// -------------------------------
// app.post("/verify-payment", async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       name,
//       brandName,
//       email,
//       contact,
//     } = req.body;
// 
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
// 
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");
// 
//     const isAuthentic = expectedSignature === razorpay_signature;
// 
//     if (isAuthentic) {
//       // 1. Check if this is a TICKET payment or MEMBERSHIP payment
//       // If dbTicketId is present, it is STRICTLY an Event Ticket payment.
//       if (req.body.dbTicketId) {
//         // --- EVENT TICKET LOGIC ---
//         // Verify payment for a specific ticket
//         // The "dbTicketId" passed here is the MongoDB _id of the pending ticket.
//         // BUT for events, we might pass the DB Ticket ID.
//         // Let's clarify: The User requested flow:
//         // 1. Create Ticket (PENDING) -> Get DB Ticket ID
//         // 2. Pay -> Redirect
//         // 3. Verify -> We need to update that DB Ticket to PAID.
// 
//         // So here, req.body should contain the DB Ticket _id presumably, or we find it via order_id if we saved it?
//         // Simpler: Client sends the DB Ticket _id in the verify request.
// 
//         const dbTicketId = req.body.dbTicketId;
//         if (dbTicketId) {
//           await Ticket.findByIdAndUpdate(dbTicketId, {
//             status: "PAID",
//             paymentId: razorpay_payment_id,
//             signature: razorpay_signature
//           });
//           // Increment Event Registration Count
//           const ticket = await Ticket.findById(dbTicketId);
//           await Event.findByIdAndUpdate(ticket.eventId, { $inc: { currentRegistrations: ticket.quantity } });
//         }
//       } else {
//         // --- MEMBERSHIP LOGIC (Existing) ---
//         await Payment.create({
//           orderId: razorpay_order_id,
//           paymentId: razorpay_payment_id,
//           signature: razorpay_signature,
//           amount: 500,
//           status: "success",
//           name,
//           brandName,
//           email,
//           contact,
//         });
//       }
// 
//       res.json({ success: true, message: "Payment verified and saved" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid Signature" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// -------------------------------
// 4. PHONEPE SDK INTEGRATION
// -------------------------------
const { StandardCheckoutClient, Env, MetaInfo, StandardCheckoutPayRequest } = require('pg-sdk-node');

const CLIENT_URL = process.env.CLIENT_URL || "https://founders-sangam.vercel.app/";
const SERVER_URL = process.env.SERVER_URL || "https://founders-sangam.onrender.com";

// Initialize PhonePe SDK Client (only once)
const phonepeEnv = (process.env.PHONEPE_ENV || '').toUpperCase() === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;
const phonepeClientVersion = process.env.PHONEPE_CLIENT_VERSION || "1"; // Must be a String

console.log("=== PhonePe SDK Config ===");
console.log("Client ID:", process.env.PHONEPE_CLIENT_ID);
console.log("Environment:", phonepeEnv === Env.PRODUCTION ? "PRODUCTION" : "SANDBOX");
console.log("Client Version:", phonepeClientVersion);

const phonepeClient = StandardCheckoutClient.getInstance(
  process.env.PHONEPE_CLIENT_ID,
  process.env.PHONEPE_CLIENT_SECRET,
  phonepeClientVersion,
  phonepeEnv
);

console.log("✅ PhonePe SDK initialized");

// Initiate Payment using SDK
app.post("/api/phonepe/pay", async (req, res) => {
  try {
    const { name, number, transactionId, type, ticketId, brandName, email } = req.body;
    // Ensure amount is handled as a number
    const amountVal = parseFloat(req.body.amount);

    console.log("=== PhonePe SDK Payment Request ===");
    console.log("Request Body:", { name, amount: amountVal, type, ticketId, brandName, email });

    const merchantOrderId = transactionId || `ORD_${Date.now()}`;

    // Save Context BEFORE calling PhonePe
    if (type === 'TICKET' && ticketId) {
      await Ticket.findByIdAndUpdate(ticketId, {
        paymentId: merchantOrderId,
        status: 'PENDING'
      });
      console.log("✅ Updated Ticket:", ticketId);
    } else {
      await Payment.create({
        orderId: merchantOrderId,
        amount: amountVal,
        status: "PENDING",
        name,
        brandName,
        email,
        contact: number,
      });
      console.log("✅ Created Payment record");
    }

    // Build payment request using SDK
    const metaInfo = MetaInfo.builder()
      .udf1(type) // TICKET or MEMBERSHIP
      .udf2(ticketId || 'N/A')
      .udf3(name)
      .udf4(email)
      .build();

    const redirectUrl = `${SERVER_URL}/api/phonepe/validate/${merchantOrderId}`;

    const paymentRequest = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(Math.round(amountVal * 100)) // Convert to paise and ensure integer
      .redirectUrl(redirectUrl)
      .metaInfo(metaInfo)
      .build();

    console.log("📤 Initiating payment with SDK...");

    // Call PhonePe SDK
    const response = await phonepeClient.pay(paymentRequest);

    console.log("✅ PhonePe SDK Response:", response);

    const checkoutUrl = response.redirectUrl;

    if (!checkoutUrl) {
      throw new Error("No checkout URL in PhonePe response");
    }

    res.json({
      success: true,
      url: checkoutUrl,
      merchantTransactionId: merchantOrderId
    });

  } catch (err) {
    console.error("=== PhonePe SDK Pay Error ===");
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack);
    if (err.response) {
      console.error("Response Data:", err.response.data);
    }
    res.status(500).json({ success: false, message: err.message || "Payment initiation failed" });
  }
});

// Callback (Server-to-Server)
app.post("/api/phonepe/callback", async (req, res) => {
  try {
    // PhonePe sends valid JSON base64 encoded in "response" body field
    // We verify the X-VERIFY header to ensure authenticity.

    // This is a placeholder for the actual callback logic which involves:
    // 1. Verifying X-VERIFY header.
    // 2. Decoding the base64 payload.
    // 3. Updating the Transaction Status in DB.

    // As defined in requirements, we are focusing on the integration.
    // We return success to acknowledge receipt.
    res.json({ success: true });
  } catch (err) {
    console.error("Callback Error", err);
    res.status(500).json({ success: false });
  }
});

// Validate Payment (Redirect URL) - Using SDK - Accepts GET and POST
app.all("/api/phonepe/validate/:txnId", async (req, res) => {
  try {
    const { txnId } = req.params;

    console.log("🔍 Checking order status for:", txnId);

    // Use SDK to check order status
    const orderStatus = await phonepeClient.getOrderStatus(txnId);

    console.log("✅ Order Status Response:", JSON.stringify(orderStatus, null, 2));

    if (orderStatus.state === "COMPLETED" && orderStatus.amount) {
      // Payment successful
      const ticket = await Ticket.findOne({ paymentId: txnId });

      if (ticket) {
        ticket.status = "PAID";
        await ticket.save();
        await Event.findByIdAndUpdate(ticket.eventId, { $inc: { currentRegistrations: ticket.quantity } });
        console.log("✅ Ticket payment completed:", ticket._id);
        return res.redirect(`${CLIENT_URL}/ticket/${ticket._id}`);
      }

      const payment = await Payment.findOne({ orderId: txnId });
      if (payment) {
        payment.status = "success";
        payment.paymentId = orderStatus.transactionId || txnId;
        await payment.save();
        console.log("✅ Membership payment completed");
        return res.redirect(`${CLIENT_URL}/ticket/access-card`);
      }

      return res.redirect(`${CLIENT_URL}?payment=success`);
    } else {
      console.log("❌ Payment failed or pending");
      return res.redirect(`${CLIENT_URL}?payment=failed`);
    }
  } catch (err) {
    console.error("❌ Payment Validation Error:", err.message);
    console.error(err.stack);
    return res.redirect(`${CLIENT_URL}?payment=error`);
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
// 7. Get Members (Protected) - WITH PAGINATION
// -------------------------------
app.get("/members", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = { status: "success" };
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Payment.countDocuments(searchQuery);
    const members = await Payment.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      members,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    });
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

    // 4. Growth/Revenue Analytics (Merged Community + Events)

    // Helper to get monthly aggregation
    const getMonthlyStats = async (model, matchCriteria) => {
      return await model.aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
    };

    const communityStats = await getMonthlyStats(Payment, { status: "success" });
    const eventStats = await getMonthlyStats(Ticket, { status: "PAID" });

    // Merging logic
    const statsMap = new Map();

    const processStats = (stats, type) => {
      stats.forEach(item => {
        const key = `${item._id.year}-${item._id.month}`;
        if (!statsMap.has(key)) {
          statsMap.set(key, { year: item._id.year, month: item._id.month, community: 0, events: 0 });
        }
        const entry = statsMap.get(key);
        entry[type] = item.count;
      });
    };

    processStats(communityStats, 'community');
    processStats(eventStats, 'events');

    // Convert to array and sort
    const growthData = Array.from(statsMap.values())
      .sort((a, b) => (a.year - b.year) || (a.month - b.month))
      .slice(-6) // Last 6 months
      .map(item => {
        const date = new Date(item.year, item.month - 1);
        return {
          name: date.toLocaleString('default', { month: 'short' }),
          community: item.community,
          events: item.events
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
// 7.5 Unified Payments API (Admin) - WITH PAGINATION
// -------------------------------
app.get("/admin/payments", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Build search conditions
    const searchConditions = search ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { contact: { $regex: search, $options: "i" } }
      ]
    } : {};

    // Aggregate Community Payments
    const communityPipeline = [
      { $match: { status: "success", ...searchConditions } },
      {
        $project: {
          _id: 1,
          paymentId: 1,
          name: 1,
          email: 1,
          contact: 1,
          amount: { $ifNull: ["$amount", 500] },
          date: "$createdAt",
          type: { $literal: "Membership" },
          source: { $literal: "Community" }
        }
      }
    ];

    // Aggregate Event Tickets
    const ticketsPipeline = [
      { $match: { status: "PAID", ...searchConditions } },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "eventData"
        }
      },
      {
        $project: {
          _id: 1,
          paymentId: 1,
          name: 1,
          email: 1,
          contact: 1,
          amount: 1,
          date: "$createdAt",
          type: { $ifNull: ["$ticketType", "Ticket"] },
          source: { $ifNull: [{ $arrayElemAt: ["$eventData.title", 0] }, "Event"] }
        }
      }
    ];

    // Union both collections
    const allPaymentsPipeline = [
      ...communityPipeline,
      { $unionWith: { coll: "tickets", pipeline: ticketsPipeline } },
      { $sort: { date: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }]
        }
      }
    ];

    const result = await Payment.aggregate(allPaymentsPipeline);
    const total = result[0].metadata[0]?.total || 0;
    const payments = result[0].data;

    res.json({
      success: true,
      payments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
});

// -------------------------------
// 8. Events API
// -------------------------------

// Get All Events (Public) - WITH PAGINATION
app.get("/events", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Event.countDocuments(searchQuery);
    const events = await Event.find(searchQuery)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      events,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
});

// Get Single Event (Public)
app.get("/events/:id", async (req, res) => {
  try {
    console.log("Fetching event with ID:", req.params.id);
    const event = await Event.findById(req.params.id);

    if (!event) {
      console.log("Event not found for ID:", req.params.id);
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    console.log("Event found:", event.title);
    res.json({ success: true, event });
  } catch (err) {
    console.error("Error fetching event:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch event" });
  }
});

// Register for Event (Create Pending Ticket)
app.post("/events/:id/register", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, companyName, email, contact, ticketType, quantity, amount } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Check Capacity
    const availableTickets = event.maxRegistrations - event.currentRegistrations;
    if (quantity > availableTickets) {
      if (availableTickets === 0) {
        return res.status(400).json({
          success: false,
          message: "Registration Full",
          availableTickets: 0
        });
      }
      return res.status(400).json({
        success: false,
        message: `Only ${availableTickets} ticket${availableTickets === 1 ? '' : 's'} available`,
        availableTickets: availableTickets
      });
    }

    const ticket = await Ticket.create({
      eventId: id,
      name,
      companyName,
      email,
      contact,
      ticketType,
      quantity,
      amount,
      status: "PENDING"
    });

    res.json({ success: true, ticketId: ticket._id });

  } catch (err) {
    console.error("Registration Error:", err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message || "Registration failed" });
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