


const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// CORS FIX (FINAL)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-domain.com",   // later add your actual domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    credentials: true,
  })
);

// Allow preflight



// JSON Parser
app.use(express.json());

// Connect DB
//connectDB();//

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/googleAuthRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/live", require("./routes/liveClassRoutes"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/notes", require("./routes/noteRoute"));

// Static Files
app.use("/uploads", express.static("uploads"));

// Start Server
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

