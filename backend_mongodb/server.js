const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

dotenv.config();

const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);

const PORT = process.env.PORT || 5000;

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to CivicLens Backend! 😊");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});