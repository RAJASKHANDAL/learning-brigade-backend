import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  SERVICE_ACCOUNT: z.string().min(1, "SERVICE_ACCOUNT is required"),
  CORS_ORIGINS: z
    .string()
    .default("https://learning-brigade-frontend.vercel.app,http://localhost:3000"),
  FIREBASE_STORAGE_BUCKET: z.string().default("learning-brigade.firebasestorage.app"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().default(10),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Invalid environment configuration:");
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  return {
    ...parsed.data,
    corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
  };
}

export const env = loadEnv();
