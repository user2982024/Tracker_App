
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load the backend environment before importing routes/controllers that read it.
dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./utils/db");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const todoRoutes = require("./routes/todoRoutes");
const goalRoutes = require("./routes/goalRoutes");
const habitRoutes = require("./routes/habitRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const errorHandler = require("./middlewares/errorMiddleware");
const mongoose = require("mongoose");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  process.env.FRONTEND_URL,
].filter(Boolean);

// Allow the deployed frontend to send and receive the authentication cookie.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    success: connected,
    api: "available",
    database: connected ? "connected" : "disconnected",
  });
});

// Return a clear, prompt response during database outages instead of allowing
// Mongoose to buffer API calls until they time out.
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database is temporarily unavailable. Please try again shortly.",
    });
  }
  next();
});

// Auth routes
app.use("/api/auth", authRoutes);

// Notes routes
app.use("/api/notes", notesRoutes);

// Todo routes
app.use("/api/todos", todoRoutes);

// Goal routes
app.use("/api/goals", goalRoutes);

// Habit routes
app.use("/api/habits", habitRoutes);

// User settings routes
app.use("/api/settings", settingsRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Keep the API process alive through a temporary database outage and retry
  // until MongoDB is reachable. Requests receive 503 while disconnected.
  while (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (error) {
      console.error(`Database connection failed: ${error.message}. Retrying in 5 seconds.`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

startServer();
