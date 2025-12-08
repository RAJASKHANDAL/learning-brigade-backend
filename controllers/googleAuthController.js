const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin");
const User = require("../models/user");

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing Firebase token" });
    }

    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ email: decoded.email });

    if (!user) {
      user = await User.create({
        name: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        password: null,
        role: null, // selected later
        profileCompleted: false,
      });
    }

    const appToken = createToken(user._id);

    res.json({
      token: appToken,
      user,
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};
