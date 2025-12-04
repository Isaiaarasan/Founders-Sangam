const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Payment = require("./models/Payment");
const Event = require("./models/Event"); // Ensure you have this model created

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
// 1. CONNECT MONGO DB
// -------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error", err));

// -------------------------------
// 2. Razorpay Instance
// -------------------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------------------------------
// 3. Create Order
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
// 4. Verify Payment (Updated for Brand Name)
// -------------------------------
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      brandName, // <--- Receive Brand Name
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
        status: "success", // Stored as lowercase
        name,
        brandName, // <--- Save Brand Name
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
// 5. Get Members (Fixed Status Bug)
// -------------------------------
app.get("/members", async (req, res) => {
  try {
    // CHANGED "SUCCESS" to "success" to match what you save
    const members = await Payment.find({ status: "success" }).sort({ createdAt: -1 });
    res.json({ success: true, members });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch members" });
  }
});

// -------------------------------
// 6. Dashboard Stats (NEW)
// -------------------------------
app.get("/admin/stats", async (req, res) => {
  try {
    const memberCount = await Payment.countDocuments({ status: "success" });
    // Assuming flat fee of 500
    const totalRevenue = memberCount * 500;

    res.json({
      success: true,
      stats: {
        totalMembers: memberCount,
        totalRevenue: totalRevenue,
        activeEvents: 3 // Replace with actual Event count query later
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// -------------------------------
// 7. Events API
// -------------------------------

// Get All Events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, events });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
});

// Create Event
app.post("/events", async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.json({ success: true, event: newEvent });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to create event" });
  }
});

// -------------------------------
// 8. Start Server
// -------------------------------
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});