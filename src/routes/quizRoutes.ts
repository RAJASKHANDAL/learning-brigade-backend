import { Router } from "express";
import { Quiz } from "../models/Quiz";
import { QuizAttempt } from "../models/QuizAttempt";
import { protect } from "../middleware/protect";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import { createQuizSchema, submitQuizAttemptSchema } from "../schemas";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../middleware/AppError";

const router = Router();

// List quizzes (metadata only — no answers, safe for students and teachers alike)
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json({
      quizzes: quizzes.map((q) => ({
        _id: q._id,
        title: q.title,
        teacherName: q.teacherName,
        questionCount: q.questions.length,
        createdAt: q.createdAt,
      })),
    });
  })
);

// Get a single quiz to attempt (correct answers stripped)
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new AppError("Quiz not found", 404);

    res.json({
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        teacherName: quiz.teacherName,
        questions: quiz.questions.map((q) => ({ question: q.question, options: q.options })),
      },
    });
  })
);

// Create a quiz (teacher only)
router.post(
  "/",
  protect,
  requireRole("teacher"),
  validateBody(createQuizSchema),
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.create({
      teacherId: req.user!._id,
      teacherName: req.user!.name,
      title: req.body.title,
      questions: req.body.questions,
    });

    res.json({ quiz });
  })
);

// Delete a quiz (teacher only, must own it)
router.delete(
  "/:id",
  protect,
  requireRole("teacher"),
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new AppError("Quiz not found", 404);

    if (quiz.teacherId.toString() !== req.user!._id.toString()) {
      throw new AppError("You can only delete your own quizzes", 403);
    }

    await quiz.deleteOne();
    res.json({ message: "Quiz deleted" });
  })
);

// Submit an attempt (student) — server computes the score
router.post(
  "/:id/attempt",
  protect,
  validateBody(submitQuizAttemptSchema),
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new AppError("Quiz not found", 404);

    const { answers } = req.body as { answers: string[] };

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] && answers[i].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score++;
      }
    });

    const attempt = await QuizAttempt.create({
      quizId: quiz._id,
      studentId: req.user!._id,
      answers,
      score,
      total: quiz.questions.length,
    });

    res.json({ score, total: quiz.questions.length, attempt });
  })
);

export default router;
