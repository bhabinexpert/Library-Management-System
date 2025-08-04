import { Schema, model } from "mongoose";
const burrowingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
      default:()=>{
        const now = new Date();
        now.setDate(now.getDate() + 15); // due date after 15 days of burrowing date
        return now
      }
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["burrowed", "returned", "overdue"],
      default: "burrowed",
    },
  },
  { timestamps: true }
);

const BurrowingModel = model("burrowing history", burrowingSchema);
export default BurrowingModel;
