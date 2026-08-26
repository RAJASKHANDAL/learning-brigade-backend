import { Schema, model, type InferSchemaType } from "mongoose";

const notesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  fileURL: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

notesSchema.index({ userId: 1 });

export type INotes = InferSchemaType<typeof notesSchema>;
export const Notes = model("Notes", notesSchema);
