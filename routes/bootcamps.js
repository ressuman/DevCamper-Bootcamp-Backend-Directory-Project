const express = require("express");
const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps"); // Import bootcamp controllers

const { protect, authorize } = require("../middlewares/auth"); // Import middleware for authentication and authorization
const advancedQueryResults = require("../middlewares/advancedQueryResults"); // Import middleware for advanced query results

const Bootcamp = require("../models/Bootcamp"); // Import Bootcamp model

//Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router(); // Create a new express router

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter); // Redirect to course router when the route matches
router.use("/:bootcampId/reviews", reviewRouter); // Redirect to review router when the route matches

// Route to get bootcamps within a certain radius
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

// Route for uploading bootcamp photos, protected and authorized
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

// Main routes for bootcamps
router
  .route("/")
  .get(advancedQueryResults(Bootcamp, "Bootcamps", "courses"), getBootcamps) // Get all bootcamps with advanced query results
  .post(protect, authorize("publisher", "admin"), createBootcamp); // Create a new bootcamp, protected and authorized

router
  .route("/:id")
  .get(getBootcamp) // Get a single bootcamp by ID
  .put(protect, authorize("publisher", "admin"), updateBootcamp) // Update a bootcamp by ID, protected and authorized
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp); // Delete a bootcamp by ID, protected and authorized

module.exports = router; // Export the router
