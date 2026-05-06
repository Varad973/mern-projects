const Student = require("../models/Student");

// @desc    Get all students
// @route   GET /api/students
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new student
// @route   POST /api/students
const addStudent = async (req, res, next) => {
  try {
    const { fullName, rollNumber, email, department, year, cgpa } = req.body;

    const student = await Student.create({
      fullName,
      rollNumber,
      email,
      department,
      year,
      cgpa,
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
const updateStudent = async (req, res, next) => {
  try {
    const { fullName, rollNumber, email, department, year, cgpa } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { fullName, rollNumber, email, department, year, cgpa },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
};
