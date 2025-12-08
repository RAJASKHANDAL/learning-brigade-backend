const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");

// Create a new post
router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Post content is required" });
    }

    const newPost = await Post.create({
      teacherId: req.user.id,
      teacherName: req.user.name,
      content
    });

    res.json({ success: true, post: newPost });
  } catch (err) {
    console.error("Post Create Error:", err);
    res.status(500).json({ error: "Server error while creating post" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    console.error("Fetch Posts Error:", err);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
});

module.exports = router;
