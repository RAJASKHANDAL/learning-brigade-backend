const User = require("../models/user");

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user._id, { profileImage: url });

    res.json({ url });
  } catch (err) {
    console.error("Profile upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};
