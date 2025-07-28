import mongoose from "mongoose"; //mongoose fro db
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import bookModel from "./models/books.models.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ option: "*" }));



// async function addBooksToDatabase() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(
//       "mongodb+srv://bhabindulal46:l8JzOlS5wRAogJs5@cluster0.qpjfjsk.mongodb.net/LMS?retryWrites=true&w=majority&appName=Cluster0",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );

//     console.log("Connected to MongoDB");

//     // Insert books
//     const result = await bookModel.insertMany(Book);

//     console.log(`${result.length} books added successfully:`);
//     result.forEach((book) => {
//       console.log(`- ${book.title}`);
//     });
//   } catch (error) {
//     console.error("Error adding books:", error);
//   } finally {
//     // Disconnect from MongoDB
//     await mongoose.disconnect();
//     console.log("Disconnected from MongoDB");
//   }
// }

// addBooksToDatabase();
