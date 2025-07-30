import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
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
      enum: ["user", "admin"],
      default: "user",
    }
  },
  { timestamps: true }
);

const userModel = model("user", userSchema)
export default userModel
