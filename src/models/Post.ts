import { Schema, model, type InferSchemaType } from "mongoose";

const commentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teacherName: { type: String, required: true },
    content: { type: String, required: true },
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

export type IPost = InferSchemaType<typeof postSchema>;
export const Post = model("Post", postSchema);
