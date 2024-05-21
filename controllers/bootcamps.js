const asyncAwaitHandler = require("../middlewares/asyncAwait");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const path = require("path");
const slugify = require("slugify");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
// Controller to get all bootcamps
exports.getBootcamps = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Send a success response with the advanced results obtained from the middleware
    res.status(200).json(res.advancedQueryResults);
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    next(error);
  }
  //res.status(200).json(res.advancedQueryResults);
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
// Controller to get a single bootcamp by ID
exports.getBootcamp = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Finding the bootcamp by ID
    const bootcamp = await Bootcamp.findById(req.params.id);

    // If bootcamp with the provided ID is not found, return an error response
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    // If bootcamp is found, send a success response with bootcamp data
    res.status(200).json({
      success: true,
      status: true,
      message: "Bootcamp retrieved successfully.",
      data: bootcamp,
    });
  } catch (error) {
    // If an error occurs during the operation, pass it to the error handling middleware
    next(error);
  }
});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
// Controller to create a new bootcamp
exports.createBootcamp = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Add the user ID to the request body
    req.body.user = req.user.id;

    // Check if the user has already published a bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If the user is not an admin and has already published a bootcamp, throw an error
    if (publishedBootcamp && req.user.role !== "admin") {
      throw new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      );
    }

    // Create a new bootcamp using the request body data
    const bootcamp = await Bootcamp.create(req.body);

    // Send a success response with the created bootcamp data
    res.status(201).json({
      success: true,
      status: true,
      message: "Bootcamp created successfully.",
      data: bootcamp,
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
//Controller to update bootcamp
exports.updateBootcamp = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the bootcamp by ID
    let bootcamp = await Bootcamp.findById(req.params.id);

    // Check if bootcamp with the provided ID exists
    if (!bootcamp) {
      // If bootcamp is not found, return an error response
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure the user is the owner of the bootcamp or an admin
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      // If user is not authorized, return an error response
      return next(
        new ErrorResponse(
          `User with ID ${req.user.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }

    // Update the slug if the name is being updated
    if (Object.keys(req.body).includes("name")) {
      req.body.slug = slugify(req.body.name, { lower: true });
    }

    // Update the bootcamp with the provided ID using the request body data
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated bootcamp
      runValidators: true, // Run validators on the update operation
    });

    // Send a success response with the updated bootcamp data
    res.status(200).json({
      success: true,
      status: true,
      message: "Bootcamp updated successfully.",
      data: bootcamp,
    });
  } catch (error) {
    // If an error occurs during the operation, pass it to the error handling middleware
    next(error);
  }
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the bootcamp by ID
    const bootcamp = await Bootcamp.findById(req.params.id);

    // Check if bootcamp with the provided ID exists
    if (!bootcamp) {
      // If bootcamp is not found, return an error response
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure the user is the owner of the bootcamp or an admin
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      // If user is not authorized, return an error response
      return next(
        new ErrorResponse(
          `User with ID ${req.user.id} is not authorized to delete this bootcamp`,
          401
        )
      );
    }

    // Remove/Delete the bootcamp
    await bootcamp.deleteOne();

    // Send a success response
    res.status(200).json({
      success: true,
      status: true,
      message: "Bootcamp deleted successfully.",
      data: {},
    });
  } catch (error) {
    // If an error occurs during the operation, pass it to the error handling middleware
    next(error);
  }
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
// Controller for getting bootcamps within a radius
exports.getBootcampsInRadius = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Extract zipcode and distance from request parameters
    const { zipcode, distance } = req.params;

    // Get latitude and longitude from geocoder based on zipcode
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calculate radius using radians
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const radiusCopy = (distance / 3963).toFixed(2);
    // Find bootcamps within the specified radius
    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    // Respond with the bootcamps found within the radius
    res.status(200).json({
      success: true,
      status: true,
      message: `Bootcamps within the specified radius of ${radiusCopy} miles have been successfully retrieved.`,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    // Handle any errors that occur during execution
    next(error);
  }
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
// Controller to upload a photo for bootcamp
exports.bootcampPhotoUpload = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find the bootcamp by ID
    const bootcamp = await Bootcamp.findById(req.params.id);

    // Check if bootcamp exists
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    // Ensure user is the owner of the bootcamp or an admin
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User with ID ${req.user.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }

    // Check if file is included in the request
    if (!req.files /* || !req.files.file*/) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Check if uploaded file is an image
    if (/*!file ||*/ !file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check file size against the maximum allowed size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      const maxSizeInMB = Math.round(
        process.env.MAX_FILE_UPLOAD / (1024 * 1024)
      ); // Convert max file size from bytes to megabytes
      return next(
        new ErrorResponse(
          `Please upload an image less than ${maxSizeInMB} MB`,
          400
        )
      );
    }

    // Create custom filename for the uploaded photo
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    // Move the uploaded file to the specified file upload path
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      // Update bootcamp document with the photo filename
      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

      // Respond with success message and filename
      res.status(200).json({
        success: true,
        status: true,
        message: "Bootcamp photo uploaded successfully.",
        data: file.name,
      });
    });
  } catch (error) {
    // Catch any errors and pass them to the error handler middleware
    next(error);
  }
});
