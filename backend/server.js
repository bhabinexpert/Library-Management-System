import mongoose from "mongoose"; //mongoose fro db
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { loginUser, registerUser } from "./controllers/auth.controller.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ option: "*" }));

app.get("/", (req, res)=>{
    res.send("GOOD HEALTH")
})

app.post("/signup", registerUser)
app.post("/login", loginUser)

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
    });
}).catch((err)=>{
    console.log("Database connection Error;", err)
});


//frontend bata endpoint call garera data backend ma pathuaney, token ko concept ley backend ma login authorization garney ani admin logged in chha ki user logged in chha kasari herrney ani individual jaty user create hunxa sabhko data dekhaune like burrowing list and every thing!!


// authentication is done now the part of authoriation is still confusing , token and token headers..