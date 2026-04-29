import express from "express";
import dotenv from "dotenv";
dotenv.config();

import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const IP = process.env.IP || "127.0.0.1";

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.use("/", dashboardRoutes);

// Start server
app.listen(PORT, IP, () => {
  console.log(`Demo Server running on http://${IP}:${PORT}`);
});
