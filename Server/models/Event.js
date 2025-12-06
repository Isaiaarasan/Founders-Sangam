const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        description: String,
        location: String,
        image: String, // URL to image
        link: String,  // Registration or details link
        content: String, // Full markdown content
        maxRegistrations: { type: Number, default: 100 },
        currentRegistrations: { type: Number, default: 0 },
        ticketTypes: [
            {
                name: { type: String, required: true },
                price: { type: Number, required: true }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
