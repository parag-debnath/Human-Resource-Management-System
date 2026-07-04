const express = require("express");
const User = require("../models/User");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/payroll/my - employee: read-only view of own salary
router.get("/my", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("salary name employeeId");
  res.json(user);
});

// GET /api/payroll - admin: view payroll of all employees
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  const users = await User.find().select("salary name employeeId department");
  res.json(users);
});

// PUT /api/payroll/:id - admin: update salary structure
router.put("/:id", verifyToken, requireAdmin, async (req, res) => {
  const { basic, allowances, deductions } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { "salary.basic": basic, "salary.allowances": allowances, "salary.deductions": deductions } },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

module.exports = router;
