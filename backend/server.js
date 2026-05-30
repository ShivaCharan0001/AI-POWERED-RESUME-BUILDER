import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Database Connection
let isConnected = false;

const connectDatabase = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  await connectDatabase();
  next();
});

app.get("/", (req, res) => res.send("Server is Live"));

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;