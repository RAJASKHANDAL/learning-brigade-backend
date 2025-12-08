const User = require("../models/user");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin");

exports.googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        
        // Firebase verify
        const decoded = await admin.auth().verifyIdToken(token);

        // Check if user exists
        let user = await User.findOne({ email: decoded.email });

        if (!user) {
            user = await User.create({
                name: decoded.name || decoded.email.split("@")[0],
                email: decoded.email,
                role: null, // no role yet
                profileCompleted: false,
            });
        }

        // Generate JWT
        const jwtToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token: jwtToken,
            user,
        });

    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ message: "Google login failed" });
    }
};
