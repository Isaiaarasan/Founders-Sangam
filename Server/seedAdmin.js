const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB Connected");

        const username = "admin";
        const password = "admin123"; // Default password

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists");
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Admin.create({ username, password: hashedPassword });
        console.log(`✅ Admin created: ${username} / ${password}`);
        process.exit();
    })
    .catch((err) => {
        console.log("❌ Error", err);
        process.exit(1);
    });
