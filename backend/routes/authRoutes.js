const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { employeeId, name, email, password, role } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Basic password rule: at least 8 chars, one number, one letter
    const passwordRule = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRule.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include a letter and a number",
      });
    }

    const existing = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existing) {
      return res.status(409).json({ message: "Email or Employee ID already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      employeeId,
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "employee",
    });

    // Note: real email verification (sending a link) is out of scope for this
    // hackathon build; isVerified defaults to true. Swap in a mail provider
    // (e.g. nodemailer) here if you need the real flow.

    res.status(201).json({
      message: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
