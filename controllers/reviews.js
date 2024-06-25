const asyncAwaitHandler = require("../middlewares/asyncAwait");
const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc      Get reviews
 * @route     GET /api/v1/reviews
 * @route     GET /api/v1/bootcamps/:bootcampId/reviews
 * @access    Public
 * Controller function for fetching reviews. It supports fetching all reviews
 * or reviews specific to a bootcamp if the bootcamp ID is provided in the request parameters.
 */
exports.getReviews = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Check if bootcampId parameter exists in the request
    if (req.params.bootcampId) {
      // Find reviews associated with the specific bootcamp ID
      const reviews = await Review.find({ bootcamp: req.params.bootcampId });

      // Send a response with the reviews data
      return res.status(200).json({
        success: true, // Indicate the request was successful
        status: true, // Additional success status
        message: `Reviews for Bootcamp ID ${req.params.bootcampId} fetched successfully.`,
        count: reviews.length, // Number of reviews found
        data: reviews, // Array of review objects
      });
    } else {
      // If no bootcampId is provided, send advanced results from middleware
      res.status(200).json(res.advancedQueryResults);
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Pass the error to the error handling middleware
    next(error);
  }
});

/**
 * @desc      Get single review
 * @route     GET /api/v1/reviews/:id
 * @access    Public
 * Controller function for fetching a single review by its ID.
 */
exports.getReview = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find review by ID and populate bootcamp details (name and description)
    const review = await Review.findById(req.params.id).populate({
      path: "bootcamp",
      select: "name description",
    });

    // If no review found, return error
    if (!review) {
      return next(
        new ErrorResponse(
          `No review found with the id of ${req.params.id}`,
          404
        )
      );
    }

    // Send response with the review data
    res.status(200).json({
      success: true, // Indicate the request was successful
      status: true, // Additional success status
      message: `Review with ID ${req.params.id} fetched successfully.`,
      data: review, // Review object
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Pass the error to the error handling middleware
    next(error);
  }
});

/**
 * @desc      Add review
 * @route     POST /api/v1/bootcamps/:bootcampId/reviews
 * @access    Private
 * Controller function for adding a review to a specific bootcamp.
 */
exports.addReview = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Set bootcamp and user IDs in the request body
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    // Find the bootcamp by ID
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    // If no bootcamp found, return an error
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp found with the id of ${req.params.bootcampId}`,
          404
        )
      );
    }

    // Create a new review with the data from the request body
    const review = await Review.create(req.body);

    // Send a success response with the created review
    res.status(201).json({
      success: true, // Indicate the request was successful
      status: true, // Additional success status
      message: "Review added successfully.",
      data: review, // The newly created review object
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Pass the error to the error handling middleware
    next(error);
  }
});

/**
 * @desc      Update review
 * @route     PUT /api/v1/reviews/:id
 * @access    Private
 * Controller function for updating a review by its ID.
 */
exports.updateReview = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the review by ID
    let review = await Review.findById(req.params.id);

    // If no review found, return an error
    if (!review) {
      return next(
        new ErrorResponse(
          `No review found with the id of ${req.params.id}`,
          404
        )
      );
    }

    // Ensure the review belongs to the user or the user is an admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(`Not authorized to update this review`, 401)
      );
    }

    // Update the review with the new data
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update operation
    });

    // Save the updated review to the database
    await review.save();

    // Send a success response with the updated review
    res.status(200).json({
      success: true, // Indicate the request was successful
      status: true,
      message: "Review updated successfully.",
      data: review, // The updated review object
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Pass the error to the error handling middleware
    next(error);
  }
});

/**
 * @desc      Delete review
 * @route     DELETE /api/v1/reviews/:id
 * @access    Private
 * Controller function for deleting a review by its ID.
 */
exports.deleteReview = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the review by ID
    const review = await Review.findById(req.params.id);

    // If no review found, return an error
    if (!review) {
      return next(
        new ErrorResponse(
          `No review found with the id of ${req.params.id}`,
          404
        )
      );
    }

    // Ensure the review belongs to the user or the user is an admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(`Not authorized to delete this review`, 401)
      );
    }

    // Remove the review from the database
    await review.deleteOne();

    // Send a success response
    res.status(200).json({
      success: true, // Indicate the request was successful
      status: true,
      message: "Review deleted successfully.",
      data: {}, // No data to return
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Pass the error to the error handling middleware
    next(error);
  }
});
