const mongoose = require("mongoose");

/**
 * Review Schema
 * Defines the structure and validation rules for review documents in MongoDB
 */
const ReviewSchema = new mongoose.Schema({
  // Title of the review
  title: {
    type: String,
    trim: true, // Trim whitespace from the title
    required: [true, "Please add a title for the review"], // Title is required
    maxlength: 100, // Maximum length of the title
  },
  // Text content of the review
  text: {
    type: String,
    required: [true, "Please add some text"], // Text is required
  },
  // Rating of the bootcamp, between 1 and 10
  rating: {
    type: Number,
    min: 1, // Minimum value for rating
    max: 10, // Maximum value for rating
    required: [true, "Please add a rating between 1 and 10"], // Rating is required
  },
  // Date the review was created, defaulting to current date and time
  createdAt: {
    type: Date,
    default: Date.now, // Default value is the current date and time
  },
  // Reference to the bootcamp being reviewed
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp", // References the Bootcamp model
    required: true, // Bootcamp reference is required
  },
  // Reference to the user who wrote the review
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // References the User model
    required: true, // User reference is required
  },
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

/**
 * Static method to get average rating and update bootcamp
 * @param {ObjectId} bootcampId - ID of the bootcamp
 */
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }, // Match reviews for the specific bootcamp
    },
    {
      $group: {
        _id: "$bootcamp", // Group by bootcamp ID
        averageRating: { $avg: "$rating" }, // Calculate the average rating
      },
    },
  ]);

  try {
    // Update bootcamp with the new average rating
    if (obj.length > 0) {
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageRating: obj[0].averageRating.toFixed(1), // Fix the average rating to one decimal place
      });
    } else {
      // If no reviews exist, remove the average rating field
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageRating: undefined,
      });
    }
  } catch (err) {
    // Log error for debugging purposes
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", async function (doc) {
  await this.constructor.getAverageRating(doc.bootcamp);
});

// Call getAverageRating before remove
ReviewSchema.post("remove", async function (doc) {
  await this.constructor.getAverageRating(doc.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
