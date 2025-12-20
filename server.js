const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

/* ✅ DEFINE corsOptions FIRST */
const corsOptions = {
  origin: [
    "https://learning-brigade-frontend.vercel.app",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/* ✅ USE corsOptions AFTER defining it */
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

connectDB();

/* ✅ Test route */
app.get("/", (req, res) => {
  res.send("Learning Brigade backend running 🚀");
});

/* ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/googleAuthRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/live", require("./routes/liveClassRoutes"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/notes", require("./routes/noteRoute"));

app.use("/uploads", express.static("uploads"));

app.use((req, res) =>
  res.status(404).json({ message: "Route not found" })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
