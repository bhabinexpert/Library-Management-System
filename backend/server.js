import mongoose from "mongoose"; //mongoose fro db
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import {getBurrowerCount, getCurrentUser, loginUser, registerUser, updateUser } from "./controllers/auth.controller.js";
import { seedAdmin } from "./authorization/seedAdmin.js";

//Import your backend controllers according to your schema and models

import {
  getAllBooks,
  updateBook,
  deleteBook,
  createBook,
  getBookById,
  countBooks,
} from "../backend/controllers/book.controller.js";


import { protect } from "./authorization/auth.middleware.js";
import { createBurrowing, getAllBurrowings, getBorrowedBooksCount, getBurrowingsByUser, getOverdueBooksCount,  returnBook } from "./controllers/burrow.controller.js";




dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ option: "*" }));

app.get("/", (req, res)=>{
    res.send("GOOD HEALTH")
})

app.post("/signup",  registerUser)

app.post("/login", loginUser)

// Books routes
app.get("/api/books", getAllBooks);
app.get("/api/books/count", countBooks);

// Burrowing routes
app.get("/api/books/burrowstatus/:id", protect, getBurrowingsByUser);
app.put("/api/books/burrow/:bookId", createBurrowing);
app.get("/api/burrowings", protect, getAllBurrowings);
app.get("/api/burrowings/count", getBorrowedBooksCount);
app.get("/api/burrowings/overdue",  getOverdueBooksCount);

//Return route:
app.put('/api/books/return/:id', protect, returnBook);


// Book management routes (these should come after more specific routes)
app.post("/api/books", protect, createBook);
app.get("/api/books/:id", getBookById);
app.put("/api/books/:id", protect, updateBook);
app.delete("/api/books/:id", protect, deleteBook);
app.post("/api/books/:id/return", protect, returnBook);

// Stats routes
app.get("/api/stats/books/count", countBooks);
app.get("/api/stats/burrowers/count", getBurrowerCount);
app.get("/api/stats/burrowed/count", getBorrowedBooksCount);
app.get("/api/stats/overdue/count", getOverdueBooksCount);


//updates user 
app.get("/api/users/me", protect, getCurrentUser);
app.put("/api/users/:id", protect, updateUser)


// hard coded the books details into db..

// async function addBooksToDatabase() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(
//       "mongodb+srv://bhabindulal46:<db password>.qpjfjsk.mongodb.net/LMS?retryWrites=true&w=majority&appName=Cluster0",
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

//Db connection:
mongoose.connect(process.env.MONGO_DB_URL).then(()=>{
    console.log("Database cennection established");
    app.listen(PORT, ()=>{
        console.log("server is running at port:", PORT)
        seedAdmin(); 
    });
}).catch((err)=>{
    console.log("Database connection Error;", err)
});


//frontend bata endpoint call garera data backend ma pathuaney, token ko concept ley backend ma login authorization garney ani admin logged in chha ki user logged in chha kasari herrney ani individual jaty user create hunxa sabhko data dekhaune like burrowing list and every thing!!


