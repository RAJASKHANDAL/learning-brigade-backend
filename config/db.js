import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://rajaskhandal40_db_user:7BWla4f0av8iJRSo@cluster0.qr3tcku.mongodb.net/?appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected!");
  } catch (err) {
    console.log("MongoDB Error:", err);
  }
};

export default connectDB;
