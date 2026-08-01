const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const User = require("./models/User");

const seedStaff = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB database successfully.");

    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const officerPasswordHash = await bcrypt.hash("officer123", 10);

    // 1. Seed or update Admin
    const adminEmail = "admin@civiclens.com";
    const adminUser = await User.findOneAndUpdate(
      { email: adminEmail },
      { name: "System Admin", email: adminEmail, password: adminPasswordHash, role: "admin" },
      { upsert: true, new: true }
    );
    console.log("Admin account updated/created:", adminUser.email, "(Role:", adminUser.role, ")");

    // 2. Seed or update Officer 1
    const officerEmail = "officer1@gmail.com";
    const officerUser = await User.findOneAndUpdate(
      { email: officerEmail },
      { name: "Officer One", email: officerEmail, password: officerPasswordHash, role: "officer" },
      { upsert: true, new: true }
    );
    console.log("Officer account updated/created:", officerUser.email, "(Role:", officerUser.role, ")");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error.message);
    process.exit(1);
  }
};

seedStaff();
