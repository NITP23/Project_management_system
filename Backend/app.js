import express from "express";
import cors from "cors";
import {config} from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from "./src/db/db.js";
import {errorMiddleware} from "./src/middlewares/error.js";
import authRouter from "./src/Router/userRoutes.js";
import adminRouter from "./src/Router/adminRoutes.js";
import studentRouter from "./src/Router/studentRoutes.js"
import {fileURLToPath} from "url"
import path, { join } from "path";
import fs from "fs";


config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

const uploadsDir = path.join(__dirname, "uploads");
const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/student",studentRouter);


app.use(errorMiddleware);

export default app;