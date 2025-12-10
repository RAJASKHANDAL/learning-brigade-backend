const mongoose = require("mongoose");
require("dotenv").config();


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://rajaskhandal40_db_user:3I04smhb3GIj1coq@cluster0.qr3tcku.mongodb.net/learning-brigade?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("Mongo error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
