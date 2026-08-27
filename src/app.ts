import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
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
import quizRoutes from "./routes/quizRoutes";

export const app = express();

const corsOptions: cors.CorsOptions = {
  origin: env.corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

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
app.use("/api/quizzes", quizRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
