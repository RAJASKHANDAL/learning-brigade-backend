import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "teacher"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1, "Missing Google token"),
});

export const setRoleSchema = z.object({
  role: z.enum(["student", "teacher"]),
});

export const studentSetupSchema = z.object({
  interestField: z.string().trim().min(1, "Select your interest field"),
  subInterests: z.array(z.string()).default([]),
});

export const joinClassSchema = z.object({
  className: z.string().trim().min(1, "className is required"),
});

export const studentDetailsSchema = z.object({
  studentType: z.string().trim().optional(),
  name: z.string().trim().optional(),
  age: z.string().trim().optional(),
  mobile: z.string().trim().optional(),
  studentEmail: z.string().trim().email().optional(),
});

export const startLiveClassSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  roomId: z.string().min(1, "roomId is required"),
});

export const createPostSchema = z.object({
  content: z.string().trim().min(1, "Post content is required"),
});

export const createCommentSchema = z.object({
  text: z.string().trim().min(1, "Comment text is required"),
});

export const createNotificationSchema = z.object({
  userId: z.string().min(1),
  message: z.string().trim().min(1),
  link: z.string().trim().optional(),
});

export const questionSchema = z.object({
  question: z.string().trim().min(1),
  options: z.array(z.string().trim().min(1)).min(2),
  correctAnswer: z.string().trim().min(1),
});

export const createQuizSchema = z.object({
  title: z.string().trim().min(1, "Quiz title is required"),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});

export const submitQuizAttemptSchema = z.object({
  answers: z.array(z.string()),
});
