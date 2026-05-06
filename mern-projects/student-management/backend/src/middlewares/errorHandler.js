const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `A student with this ${field} already exists`,
    });
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
