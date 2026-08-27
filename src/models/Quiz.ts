import { Schema, model, type InferSchemaType } from "mongoose";

const questionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
  },
  { _id: false }
);

const quizSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teacherName: { type: String, required: true },
    title: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
  },
  { timestamps: true }
);

quizSchema.index({ teacherId: 1 });

export type IQuiz = InferSchemaType<typeof quizSchema>;
export const Quiz = model("Quiz", quizSchema);
