const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");

const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "YOUR_GOOGLE_CLIENT_ID",
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_SIGNIN",
        role: "student",
      });
    }

    res.json({
      message: "Google Login Success",
      user,
    });
  } catch (err) {
    console.log("GOOGLE LOGIN ERROR:", err);
    res.status(400).json({ message: "Google Login Failed" });
  }
};
