const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashed });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Updated register API endpoint
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body; // Removed confirmPassword from destructuring

//   // Validation checks
//   if (!name || !email || !password) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already in use" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       createdAt: new Date()
//     });

//     // Save user
//     await newUser.save();

//     // Generate JWT token (optional)
//     const token = jwt.sign(
//       { userId: newUser._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // Return success response
//     res.status(201).json({ 
//       message: "Registration successful", 
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email
//       },
//       token
//     });

//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ 
//       error: "Registration failed",
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
