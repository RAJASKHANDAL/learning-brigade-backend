import { Schema, model, type InferSchemaType } from "mongoose";

const liveClassSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  roomId: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  teacherName: { type: String, required: true },
  isLive: { type: Boolean, default: false },
  startedAt: { type: Date },
});

liveClassSchema.index({ roomId: 1 });
liveClassSchema.index({ isLive: 1 });

export type ILiveClass = InferSchemaType<typeof liveClassSchema>;
export const LiveClass = model("LiveClass", liveClassSchema);
