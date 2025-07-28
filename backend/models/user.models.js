import { model, Schema } from "mongoose";

const burrowerSchema = new Schema(
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
  },
  { timestamps: true }
);

const burrowerModel = model("burrower", burrowerSchema)
export default burrowerModel
