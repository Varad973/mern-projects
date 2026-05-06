const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
