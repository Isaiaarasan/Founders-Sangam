const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        description: String,
        location: String,
        image: String, // URL to image
        link: String,  // Registration or details link
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
