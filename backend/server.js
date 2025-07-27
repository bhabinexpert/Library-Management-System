import mongoose from "mongoose"; //mongoose fro db
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();


const PORT = process.env.PORT;

app.use(morgan("dev"))
app.use(express.json())
app.use(cors({option: "*"}))
