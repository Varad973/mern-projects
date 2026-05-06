const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    },
    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],
      min: [0, "CGPA cannot be less than 0"],
      max: [10, "CGPA cannot be more than 10"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
