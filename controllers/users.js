const asyncAwaitHandler = require("../middlewares/asyncAwait");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 * Controller function to to get all users
 */
exports.getUsers = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Send the advanced query results as the response
    res.status(200).json(res.advancedQueryResults);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

/**
 * @desc      Get single user
 * @route     GET /api/v1/users/:id
 * @access    Private/Admin
 * Controller function to get a single user by ID
 */
exports.getUser = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Retrieve user by ID from the request parameters
    const user = await User.findById(req.params.id);

    // If user not found, return a 404 Not Found error
    if (!user) {
      return next(
        new ErrorResponse(`No user found with the ID of ${req.params.id}`, 404)
      );
    }

    // Send success response with user data
    res.status(200).json({
      success: true,
      status: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

/**
 * @desc      Create user
 * @route     POST /api/v1/users
 * @access    Private/Admin
 * Controller function to create a new user
 */
exports.createUser = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Create a new user with the data from the request body
    const user = await User.create(req.body);

    // Send a success response with the created user data
    res.status(201).json({
      success: true,
      status: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

/**
 * @desc      Update user
 * @route     PUT /api/v1/users/:id
 * @access    Private/Admin
 * Controller function to update user details
 */
exports.updateUser = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the user by ID and update their details
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated user
      runValidators: true, // Run model validators
    });

    // If user is not found, return an error response
    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Send a success response with the updated user data
    res.status(200).json({
      success: true,
      status: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

/**
 * @desc      Delete user
 * @route     DELETE /api/v1/users/:id
 * @access    Private/Admin
 * Controller function to delete a user
 */
exports.deleteUser = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(req.params.id);

    // If user is not found, return an error response
    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Send a success response with an empty data object
    res.status(200).json({
      success: true,
      status: true,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});
