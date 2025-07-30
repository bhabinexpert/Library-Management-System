import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);

  
  const exists = await userModel.findOne({ email: process.env.adminEmail });
  if (!exists) {
    const hashedPassword = bcrypt.hash(process.env.adminPw, 10);

    await userModel.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin seeded successfully.");
  } else {
    console.log("ℹ️ Admin already exists.");
  }

  mongoose.disconnect();
};

seedAdmin();
