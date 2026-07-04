const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employee", "admin"], default: "employee" },

    jobTitle: { type: String, default: "" },
    department: { type: String, default: "" },
    dateJoined: { type: Date, default: Date.now },

    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    profilePicture: { type: String, default: "" },

    salary: {
      basic: { type: Number, default: 0 },
      allowances: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
    },

    documents: [{ type: String }],
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
