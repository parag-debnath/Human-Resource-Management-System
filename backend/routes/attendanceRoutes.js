const express = require("express");
const Attendance = require("../models/Attendance");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const todayStr = () => new Date().toISOString().split("T")[0];

// POST /api/attendance/checkin
router.post("/checkin", verifyToken, async (req, res) => {
  const date = todayStr();
  let record = await Attendance.findOne({ employee: req.user.id, date });
  if (record && record.checkIn) {
    return res.status(400).json({ message: "Already checked in today" });
  }
  if (!record) {
    record = await Attendance.create({ employee: req.user.id, date, checkIn: new Date() });
  } else {
    record.checkIn = new Date();
    await record.save();
  }
  res.json(record);
});

// POST /api/attendance/checkout
router.post("/checkout", verifyToken, async (req, res) => {
  const date = todayStr();
  const record = await Attendance.findOne({ employee: req.user.id, date });
  if (!record || !record.checkIn) {
    return res.status(400).json({ message: "You must check in before checking out" });
  }
  record.checkOut = new Date();
  await record.save();
  res.json(record);
});

// GET /api/attendance/my - employee's own attendance (daily/weekly history)
router.get("/my", verifyToken, async (req, res) => {
  const records = await Attendance.find({ employee: req.user.id }).sort({ date: -1 });
  res.json(records);
});

// GET /api/attendance - admin: view attendance of all employees
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  const records = await Attendance.find().populate("employee", "name employeeId department").sort({ date: -1 });
  res.json(records);
});

// GET /api/attendance/employee/:id - admin: view one employee's attendance
router.get("/employee/:id", verifyToken, requireAdmin, async (req, res) => {
  const records = await Attendance.find({ employee: req.params.id }).sort({ date: -1 });
  res.json(records);
});

module.exports = router;
