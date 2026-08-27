import { Schema, model, type InferSchemaType } from "mongoose";

const quizAttemptSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: { type: [String], required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ quizId: 1, studentId: 1 });

export type IQuizAttempt = InferSchemaType<typeof quizAttemptSchema>;
export const QuizAttempt = model("QuizAttempt", quizAttemptSchema);
