const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// CONNECT DATABASE
connectDB();

// CORS FIX (IMPORTANT)
app.use(
  cors({
    origin: [
      "https://learning-brigade-frontend.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// JSON Parser
app.use(express.json());

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Learning Brigade backend running 🚀");
});

// ROUTES (REGISTER BEFORE 404)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/googleAuthRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/live", require("./routes/liveClassRoutes"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/notes", require("./routes/noteRoute"));

// STATIC FILES
app.use("/uploads", express.static("uploads"));

// 404 HANDLER (MUST BE LAST)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
