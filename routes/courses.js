const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses"); // Import course controllers

const advancedQueryResults = require("../middlewares/advancedQueryResults"); // Import middleware for advanced query results
const { protect, authorize } = require("../middlewares/auth"); // Import middleware for authentication and authorization

const Course = require("../models/Course"); // Import Course model

const router = express.Router({ mergeParams: true }); // Create a new express router instance, allowing merging of params

// Route for getting all courses and adding a new course
router
  .route("/")
  .get(
    advancedQueryResults(Course, "Courses", {
      path: "bootcamp",
      select: "name description email website location.city",
    }), // Get all courses with advanced query capabilities
    getCourses // Controller to get courses
  )
  .post(protect, authorize("publisher", "admin"), addCourse); // Add a new course, protected and authorized

// Route for getting, updating, and deleting a specific course by ID
router
  .route("/:id")
  .get(getCourse) // Get a specific course by ID
  .put(protect, authorize("publisher", "admin"), updateCourse) // Update a specific course by ID, protected and authorized
  .delete(protect, authorize("publisher", "admin"), deleteCourse); // Delete a specific course by ID, protected and authorized

module.exports = router; // Export the router
