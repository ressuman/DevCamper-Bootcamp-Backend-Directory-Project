const mongoose = require("mongoose");

// Define the Course schema
const CourseSchema = new mongoose.Schema({
  // Title of the course
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  // Description of the course
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  // Duration of the course in weeks
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  // Tuition cost of the course
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  // Minimum skill level required for the course
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  // Indicates whether scholarship is available for the course
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  // Timestamp of course creation
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Reference to the bootcamp the course belongs to
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  // Reference to the user who created the course
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to calculate and update the average cost of courses for a bootcamp
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const objArr = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  // Calculate the average cost and update the Bootcamp document
  const averageCost = objArr[0]
    ? Math.ceil(objArr[0].averageCost / 10) * 10
    : undefined;
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost,
    });
  } catch (err) {
    console.error(err);
  }
};

// Middleware: Call getAverageCost after a course is saved
CourseSchema.post("save", async function (doc) {
  await this.constructor.getAverageCost(doc.bootcamp);
});

// Middleware: Call getAverageCost after a course is removed/deleted
CourseSchema.post("remove", async function (doc) {
  await this.constructor.getAverageCost(doc.bootcamp);
});

// // Middleware: Call getAverageCost after a course's tuition is updated
// CourseSchema.post("findOneAndUpdate", async function (doc) {
//   // Check if the tuition has changed
//   if (this.tuition !== doc.tuition) {
//     await doc.constructor.getAverageCost(doc.bootcamp);
//   }
// });

// Export the Course model
module.exports = mongoose.model("Course", CourseSchema);
