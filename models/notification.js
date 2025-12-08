const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // student or teacher id
  message: { type: String, required: true },
  link: { type: String },                      // optional redirect link
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
