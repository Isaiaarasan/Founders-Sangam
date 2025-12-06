const mongoose = require("mongoose");

const SystemSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: "global" },
    isMaintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "We are currently undergoing maintenance. Please check back later." },
});

module.exports = mongoose.model("SystemSettings", SystemSettingsSchema);
