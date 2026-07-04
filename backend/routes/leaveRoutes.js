const express = require("express");
const Leave = require("../models/Leave");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// POST /api/leaves/apply
router.post("/apply", verifyToken, async (req, res) => {
  const { leaveType, startDate, endDate, remarks } = req.body;
  if (!leaveType || !startDate || !endDate) {
    return res.status(400).json({ message: "Leave type and date range are required" });
  }
  const leave = await Leave.create({
    employee: req.user.id,
    leaveType,
    startDate,
    endDate,
    remarks,
  });
  res.status(201).json(leave);
});

// GET /api/leaves/my - employee's own leave requests
router.get("/my", verifyToken, async (req, res) => {
  const leaves = await Leave.find({ employee: req.user.id }).sort({ createdAt: -1 });
  res.json(leaves);
});

// GET /api/leaves - admin: all leave requests
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  const leaves = await Leave.find().populate("employee", "name employeeId department").sort({ createdAt: -1 });
  res.json(leaves);
});

// PUT /api/leaves/:id/status - admin: approve/reject with comment
router.put("/:id/status", verifyToken, requireAdmin, async (req, res) => {
  const { status, adminComment } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be Approved or Rejected" });
  }
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status, adminComment },
    { new: true }
  );
  if (!leave) return res.status(404).json({ message: "Leave request not found" });
  res.json(leave);
});

module.exports = router;
