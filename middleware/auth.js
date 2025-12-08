const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ message: "Token missing" });

    // VERIFY TOKEN WITH THE SAME SECRET YOU USED IN LOGIN
    const decoded = jwt.verify(token, "SECRET_JWT_KEY");

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.log("AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
