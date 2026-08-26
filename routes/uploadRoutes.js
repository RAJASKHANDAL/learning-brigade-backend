const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { uploadProfileImage } = require("../controllers/uploadController");

router.post("/profile", protect, upload.single("image"), uploadProfileImage);

module.exports = router;
