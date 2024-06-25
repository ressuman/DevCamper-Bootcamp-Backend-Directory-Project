const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const asyncAwaitHandler = require("../middlewares/asyncAwait");

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
// Controller function to get courses
exports.getCourses = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Check if bootcampId parameter exists in the request
    if (req.params.bootcampId) {
      // Fetch courses associated with the specified bootcampId
      const courses = await Course.find({ bootcamp: req.params.bootcampId });

      // Return success response with courses data
      return res.status(200).json({
        success: true,
        status: true,
        message: "All Courses retrieved successfully.",
        count: courses.length,
        data: courses,
      });
    } else {
      // If bootcampId parameter is not provided, return the advanced results obtained from previous middleware
      return res.status(200).json(res.advancedQueryResults);
    }
  } catch (err) {
    // Handle any errors and pass to the error handling middleware
    next(err);
  }
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
// Controller function to get a single course by ID
exports.getCourse = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the course by ID and populate the associated bootcamp information
    const course = await Course.findById(req.params.id).populate({
      path: "bootcamp",
      select: "name description email website",
    });
    // If no course is found with the specified ID, return an error response
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }
    // If course is found, return success response with course data
    res.status(200).json({
      success: true,
      status: true,
      message: "Course retrieved successfully.",
      data: course,
    });
  } catch (err) {
    // Handle any errors and pass to the error handling middleware
    next(err);
  }
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
// Controller function to add a course to a bootcamp
exports.addCourse = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Assign bootcamp and user ID from request parameters and authenticated user
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    // Find the bootcamp by ID
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    // If no bootcamp is found with the specified ID, return an error response
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with the id of ${req.params.bootcampId}`,
          404
        )
      );
    }

    // Check if the authenticated user is the owner of the bootcamp or an admin
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User with ID ${req.user.id} is not authorized to add a course to bootcamp with ID ${bootcamp._id}`,
          401
        )
      );
    }

    // Create a new course with the provided request body
    const course = await Course.create(req.body);

    // Return success response with the created course data
    res.status(200).json({
      success: true,
      status: true,
      message: "Course created successfully.",
      data: course,
    });
  } catch (err) {
    // Handle any errors and pass to the error handling middleware
    next(err);
  }
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
// Controller function to update a course
exports.updateCourse = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the course by ID
    let course = await Course.findById(req.params.id);

    // If no course is found with the specified ID, return an error response
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }

    // Check if the authenticated user is the owner of the course or an admin
    if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User with ID ${req.user.id} is not authorized to update course with ID ${course._id}`,
          401
        )
      );
    }

    // Update the course with the provided request body
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Save the updated course
    await course.save();

    // Return success response with the updated course data
    res.status(200).json({
      success: true,
      status: true,
      message: "Course updated successfully.",
      data: course,
    });
  } catch (err) {
    // Handle any errors and pass to the error handling middleware
    next(err);
  }
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
// Controller function to delete a course
exports.deleteCourse = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the course by ID
    const course = await Course.findById(req.params.id);

    // If no course is found with the specified ID, return an error response
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }

    // Check if the authenticated user is the owner of the course or an admin
    if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User with ID ${req.user.id} is not authorized to delete course with ID ${course._id}`,
          401
        )
      );
    }

    // Remove the course from the database
    await course.deleteOne();

    // Return success response
    res.status(200).json({
      success: true,
      status: true,
      message: "Course deleted successfully.",
      data: {},
    });
  } catch (err) {
    // Handle any errors and pass to the error handling middleware
    next(err);
  }
});
