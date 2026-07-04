const express = require("express");
const User = require("../models/User");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/employees/me - view own profile
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// PUT /api/employees/me - employee can edit limited fields only
router.put("/me", verifyToken, async (req, res) => {
  const { phone, address, profilePicture } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { phone, address, profilePicture } },
    { new: true }
  ).select("-password");
  res.json(user);
});

// GET /api/employees - admin: list all employees
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// GET /api/employees/:id - admin: view a specific employee
router.get("/:id", verifyToken, requireAdmin, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// PUT /api/employees/:id - admin can edit all employee details
router.put("/:id", verifyToken, requireAdmin, async (req, res) => {
  const { name, jobTitle, department, phone, address, profilePicture } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { name, jobTitle, department, phone, address, profilePicture } },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

module.exports = router;
