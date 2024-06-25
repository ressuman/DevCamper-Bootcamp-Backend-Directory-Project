const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users"); // Import user controllers

const { protect, authorize } = require("../middlewares/auth"); // Import middleware for authentication and authorization
const advancedQueryResults = require("../middlewares/advancedQueryResults"); // Import middleware for advanced query results

const User = require("../models/User"); // Import User model

const router = express.Router({ mergeParams: true }); // Create a new express router instance, allowing merging of params

// Apply protect middleware to all routes in this router to ensure only authenticated users can access
router.use(protect);

// Apply authorize middleware to all routes in this router to ensure only admin users can access
router.use(authorize("admin"));

// Route for getting all users and adding a new user
router
  .route("/")
  .get(advancedQueryResults(User, "Users"), getUsers) // Get all users with advanced query capabilities
  .post(createUser); // Add a new user

// Route for getting, updating, and deleting a specific user by ID
router
  .route("/:id")
  .get(getUser) // Get a specific user by ID
  .put(updateUser) // Update a specific user by ID
  .delete(deleteUser); // Delete a specific user by ID

module.exports = router; // Export the router
