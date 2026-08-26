import { Schema, model, type InferSchemaType } from "mongoose";

const postSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teacherName: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export type IPost = InferSchemaType<typeof postSchema>;
export const Post = model("Post", postSchema);
