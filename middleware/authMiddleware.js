// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;  // ✅ SAME source everywhere

const protect = async (req, res, next) => {
  try {
    let token;

    // Read token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1].trim();
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token with SAME SECRET
    const decoded = jwt.verify(token, JWT_SECRET);

    // Load user without password
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = protect;
