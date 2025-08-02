import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/user.models.js";

export const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);

  const exists = await userModel.findOne({ email: process.env.adminEmail });
  if (!exists) {
    const hashedPassword = await bcrypt.hash(process.env.adminPw, 10);

    await userModel.create({
      fullName: "Admin",
      email: process.env.adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin seeded successfully.");
  }

};
