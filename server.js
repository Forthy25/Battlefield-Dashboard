import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Session secret must be set
if (!process.env.SESSION_SECRET) {
  console.error("ERROR: SESSION_SECRET is not set in .env file!");
  process.exit(1);
}

import matchRoutes from "./routes/matchRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const IP = process.env.IP || "127.0.0.1";

// Middlewares
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  }),
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json()); // Parse JSON requests
app.use(express.static("public")); // Serve static files
app.set("view engine", "ejs"); // Use EJS as template engine

// Import routes
app.use("/matches", matchRoutes);
app.use("/", dashboardRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start Express server after successful database connection
    app.listen(PORT, IP, () => {
      console.log(`Server is running on http://${IP}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
