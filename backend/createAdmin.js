const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL.toLowerCase(),
    });

    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        console.log("Admin account already exists.");
      } else {
        existingAdmin.role = "admin";
        await existingAdmin.save();

        console.log("Existing user has been promoted to admin.");
      }

      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      12
    );

    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "admin",
    });

    console.log("========================================");
    console.log("CricFusion Admin Created Successfully");
    console.log("========================================");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("========================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();