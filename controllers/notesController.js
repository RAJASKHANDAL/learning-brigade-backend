const Notes = require("../models/NotesModel");

exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const newNote = await Notes.create({
      userId: req.user._id,
      filename: req.file.originalname,
      fileURL: `http://localhost:5000/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    });

    res.json({ message: "Uploaded successfully", note: newNote });

  } catch (err) {
    console.log("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

exports.getMyNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Notes.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
