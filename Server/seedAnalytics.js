const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Payment = require("./models/Payment");

dotenv.config();

const sampleNames = [
    "Aarav Patel", "Vihaan Rao", "Aditya Sharma", "Sai Kapoor", "Reyansh Gupta",
    "Arjun Singh", "Vivaan Joshi", "Rohan Mehta", "Ishaan Verma", "Dhruv Malhotra",
    "Ananya Reddy", "Diya Nair", "Saanvi Chatterjee", "Pari Iyer", "Myra Saxena"
];

const sampleBrands = [
    "TechFlow", "GreenEarth", "UrbanSpark", "NextGen Sol", "CodeCraft",
    "EduCare", "Healthify", "AgroTech", "FinServe", "BuildWise"
];

const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Optional: Clear existing payments (comment out if you want to keep them)
        // await Payment.deleteMany({});
        // console.log("Cleared existing payments.");

        const payments = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);

        for (let i = 0; i < 50; i++) {
            const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
            const randomBrand = sampleBrands[Math.floor(Math.random() * sampleBrands.length)];

            payments.push({
                orderId: `order_seed_${Math.random().toString(36).substring(7)}`,
                paymentId: `pay_seed_${Math.random().toString(36).substring(7)}`,
                signature: "seed_signature",
                amount: 500,
                currency: "INR",
                status: "success",
                name: randomName,
                brandName: randomBrand,
                email: `${randomName.toLowerCase().replace(" ", ".")}@example.com`,
                contact: "9876543210",
                createdAt: generateRandomDate(startDate, endDate)
            });
        }

        await Payment.insertMany(payments);
        console.log(`Successfully seeded ${payments.length} payment records!`);

        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedData();
