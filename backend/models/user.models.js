import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      match: /^[A-Za-z\s]+$/, // No numbers allowed
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/, // Valid email pattern
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role:{
      type: String,
      enum: ["burrower", "admin"],
      default: "burrower",
    }
  },
  { timestamps: true }
);

const userModel = model("User", userSchema)
export default userModel
