import { Router } from "express";
import { Post } from "../models/Post";
import { protect } from "../middleware/protect";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import { createPostSchema, createCommentSchema } from "../schemas";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../middleware/AppError";

const router = Router();

// Create a new post (teachers only)
router.post(
  "/",
  protect,
  requireRole("teacher"),
  validateBody(createPostSchema),
  asyncHandler(async (req, res) => {
    const newPost = await Post.create({
      teacherId: req.user!.id,
      teacherName: req.user!.name,
      content: req.body.content,
    });

    res.json({ success: true, post: newPost });
  })
);

// Get all posts
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ success: true, posts });
  })
);

// Add a comment to a post (any authenticated user)
router.post(
  "/:postId/comments",
  protect,
  validateBody(createCommentSchema),
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.postId);
    if (!post) throw new AppError("Post not found", 404);

    post.comments.push({
      userId: req.user!._id,
      name: req.user!.name,
      text: req.body.text,
    });
    await post.save();

    res.json({ success: true, comments: post.comments });
  })
);

// Delete your own comment (or the post owner can remove any comment on their post)
router.delete(
  "/:postId/comments/:commentId",
  protect,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.postId);
    if (!post) throw new AppError("Post not found", 404);

    const commentId = req.params.commentId;
    if (!commentId) throw new AppError("Comment not found", 404);

    const comment = post.comments.id(commentId);
    if (!comment) throw new AppError("Comment not found", 404);

    const isOwnComment = comment.userId.toString() === req.user!._id.toString();
    const isPostOwner = post.teacherId.toString() === req.user!._id.toString();

    if (!isOwnComment && !isPostOwner) {
      throw new AppError("You can only delete your own comments", 403);
    }

    comment.deleteOne();
    await post.save();

    res.json({ success: true, comments: post.comments });
  })
);

export default router;
