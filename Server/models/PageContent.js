const mongoose = require("mongoose");

const pageContentSchema = new mongoose.Schema({
    section: { type: String, required: true, unique: true }, // e.g., "hero", "stats", "testimonials"
    content: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexible structure
});

module.exports = mongoose.model("PageContent", pageContentSchema);
