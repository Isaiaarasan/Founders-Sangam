const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
    {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
        paymentId: { type: String }, // Razorpay Payment ID
        name: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true },
        ticketType: { type: String, required: true }, // e.g., "General", "VIP"
        quantity: { type: Number, default: 1 },
        amount: { type: Number, required: true },
        status: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
        guestInfo: mongoose.Schema.Types.Mixed, // For future use if multiple guests
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
