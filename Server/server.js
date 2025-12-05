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
app.get("/admin/stats", authMiddleware, async (req, res) => {
  try {
    const memberCount = await Payment.countDocuments({ status: "success" });
    const totalRevenue = memberCount * 500;
    const eventCount = await Event.countDocuments();

    res.json({
      success: true,
      stats: {
        totalMembers: memberCount,
        totalRevenue: totalRevenue,
        activeEvents: eventCount
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
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
// 10. Start Server
// -------------------------------
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});