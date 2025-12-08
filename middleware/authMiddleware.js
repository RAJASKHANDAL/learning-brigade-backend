// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// IMPORTANT: use the SAME secret everywhere (login, googleAuth, middleware)
const JWT_SECRET = "secretKey123"; // <--- use whatever you used in login/googleAuth

const protect = async (req, res, next) => {
  try {
    let token;

    // Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1].trim();
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // verify with SAME secret
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = protect;
