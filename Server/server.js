const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Payment = require("./models/Payment");

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

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// -------------------------------
// 4. Verify Payment
// -------------------------------
app.post("/verify-payment", async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.json({ success: false, message: "Invalid Signature" });
  }

  // SAVE to MongoDB
  await Payment.create({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    status: "SUCCESS",
    amount: 500,
  });

  res.json({ success: true, message: "Payment Verified" });
});

// -------------------------------
// 5. Start Server
// -------------------------------
app.listen(5000, () => {
  console.log("🚀 Server running on https://founders-sangam.onrender.com/");
});
