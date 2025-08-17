import { model } from "mongoose";
import { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    isbn: { type: String, unique: true, required: true },
    publisher: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    coverImage: { type: String, required: true }, // URL publicly available
    availableCopies: { type: Number, required: true, default: 10},
    totalCopies: { type: Number, required: true, default: 10 },
  },
  { timestamps: true }
);

const bookModel = model("Book", bookSchema);
//stores the data of the book information in the database table..

export default bookModel;
