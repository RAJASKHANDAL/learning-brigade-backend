const User = require("../models/user");
const jwt = require("jsonwebtoken");

// CREATE USER (Signup)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // prevent duplicates
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user with full student fields
    const user = new User({
      name,
      email,
      password,
      role: role || "student",

      // Required student fields (fix)
      profileCompleted: false,
      interestField: "",
      subInterests: [],
      joinedClasses: []
    });

    await user.save();

    const token = user.generateJwtToken();

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Signup failed" });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate token
    const token = jwt.sign({id: user._id,role: user.role,email: user.email},"SECRET_JWT_KEY",{ expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { 
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};
const User = require("../models/user");

// GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/student/setup
exports.updateStudentSetup = async (req, res) => {
  try {
    const { interestField, subInterests } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.interestField = interestField;
    user.subInterests = subInterests || [];
    await user.save();

    res.json({ user });
  } catch (err) {
    console.error("updateStudentSetup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/join-class
exports.joinClass = async (req, res) => {
  try {
    const { className } = req.body;
    if (!className) {
      return res.status(400).json({ message: "className is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.joinedClasses.includes(className)) {
      user.joinedClasses.push(className);
      await user.save();
    }

    res.json({ joinedClasses: user.joinedClasses });
  } catch (err) {
    console.error("joinClass error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

