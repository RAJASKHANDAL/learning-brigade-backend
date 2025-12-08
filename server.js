


const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// CORS FIX (FINAL)
app.use(
  cors({
    origin: [
      "https://learning-brigade-frontend.vercel.app",
      "http://localhost:3000"
    ],
    credentials: true,
  })
);


// Allow preflight

//app.options("*", cors());


// JSON Parser
app.use(express.json());

// Connect DB
//connectDB();//

// Default route
app.get("/", (req, res) => {
  res.send("Learning Brigade backend running 🚀");
});
// 404 fallback (instead of "*")
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
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
// TEST
app.get("/", (req, res) => {
  res.send("Learning Brigade backend running ✅");
});
// Start Server
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

