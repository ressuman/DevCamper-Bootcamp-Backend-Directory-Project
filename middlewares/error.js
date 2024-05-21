const ErrorResponse = require("../utils/errorResponse");

// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  // Create a copy of the error object
  let error = { ...err };

  // Set the error message to the message property of the error object
  error.message = err.message;

  // Log the error to the console for development purposes
  console.error(err);

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    //const message = "Resource not found";
    const message = `Resource not found with id of ${err.value}`;
    //error = new ErrorResponse(message, 404);
    error = new ErrorResponse(message, 404);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Send response with appropriate status code and error message
  res.status(error.statusCode || 500).json({
    success: false,
    status: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
