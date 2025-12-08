const User = require("../models/user");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin");

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);
    const { email, name } = decoded;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email,
        password: null,
        role: null,
        profileCompleted: false,
        courses: [],
        uploadedNotes: []
      });
    }

    // Create JWT Token (MATCH MIDDLEWARE)
    const authToken = jwt.sign(
      { id: user._id },
      "SECRET_JWT_KEY",
      { expiresIn: "7d" }
    );

    return res.json({
      token: authToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
        interestField: user.interestField,
        subInterests: user.subInterests
      }
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid Google token" });
  }
};
