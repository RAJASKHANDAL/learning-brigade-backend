import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/authRoutes";
import googleAuthRoutes from "./routes/googleAuthRoutes";
import userRoutes from "./routes/userRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import liveClassRoutes from "./routes/liveClassRoutes";
import postsRoute from "./routes/postsRoute";
import noteRoute from "./routes/noteRoute";
import uploadRoutes from "./routes/uploadRoutes";

export const app = express();

const corsOptions: cors.CorsOptions = {
  origin: env.corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Learning Brigade backend running");
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/live", liveClassRoutes);
app.use("/api/posts", postsRoute);
app.use("/api/notes", noteRoute);
app.use("/api/upload", uploadRoutes);

app.use("/uploads", express.static("uploads"));

app.use(notFoundHandler);
app.use(errorHandler);
