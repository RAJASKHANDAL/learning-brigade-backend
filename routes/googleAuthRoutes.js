const express = require("express");
const router = express.Router();
const { googleAuthController } = require("../controllers/googleAuthController");

// POST /api/auth/google
router.post("/google", googleAuthController);

// Test route
router.get("/google", (req, res) => {
  res.json({ message: "POST only" });
});

module.exports = router;
