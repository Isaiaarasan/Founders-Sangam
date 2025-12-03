const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: String,
    paymentId: String,
    signature: String,
    status: String,
    amount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
