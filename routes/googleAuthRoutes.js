// backend/routes/googleAuthRoutes.js
const express = require("express");
const { googleAuth } = require("../controllers/googleAuthController");

const router = express.Router();

// GOOGLE LOGIN ROUTE
router.post("/google", googleAuth);

module.exports = router;
