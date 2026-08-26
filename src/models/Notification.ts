import { Schema, model, type InferSchemaType } from "mongoose";

const notificationSchema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ userId: 1, createdAt: -1 });

export type INotification = InferSchemaType<typeof notificationSchema>;
export const Notification = model("Notification", notificationSchema);
