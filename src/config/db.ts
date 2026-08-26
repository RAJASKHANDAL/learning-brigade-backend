import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", (err as Error).message);
    // Fail fast BEFORE the HTTP server starts accepting traffic — the old
    // JS version connected in parallel with app.listen() and exited after
    // the server had already started, which caused a Render crash-loop
    // where a handful of requests would land on a server with no DB.
    process.exit(1);
  }
}
