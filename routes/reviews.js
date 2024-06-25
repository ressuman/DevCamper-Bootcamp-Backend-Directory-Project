const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews"); // Import review controllers
const Review = require("../models/Review"); // Import Review model

const { protect, authorize } = require("../middlewares/auth"); // Import middleware for authentication and authorization
const advancedQueryResults = require("../middlewares/advancedQueryResults"); // Import middleware for advanced query results

const router = express.Router({ mergeParams: true }); // Create a new express router instance, allowing merging of params

// Route for getting all reviews and adding a new review
router
  .route("/")
  .get(
    advancedQueryResults(Review, "Reviews", {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  ) // Get all reviews with advanced query capabilities
  .post(protect, authorize("user", "admin"), addReview); // Add a new review (only for authenticated users and admins)

// Route for getting, updating, and deleting a specific review by ID
router
  .route("/:id")
  .get(getReview) // Get a specific review by ID
  .put(protect, authorize("user", "admin"), updateReview) // Update a specific review by ID (only for authenticated users and admins)
  .delete(protect, authorize("user", "admin"), deleteReview); // Delete a specific review by ID (only for authenticated users and admins)

module.exports = router; // Export the router
