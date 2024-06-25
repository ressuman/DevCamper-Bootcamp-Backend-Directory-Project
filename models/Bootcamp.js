const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

// Define the bootcamp schema
const BootcampSchema = new mongoose.Schema(
  {
    // Bootcamp name field
    name: {
      type: String,
      required: [true, "Please add a name"], // Name is required
      unique: true, // Name must be unique
      trim: true, // Trim whitespace from name
      maxlength: [75, "Name cannot be more than 50 characters"], // Maximum length for name
    },
    // Bootcamp slug field
    slug: String,
    // Bootcamp description field
    description: {
      type: String,
      required: [true, "Please add a description"], // Description is required
      maxlength: [500, "Description cannot be more than 500 characters"], // Maximum length for description
    },
    // Bootcamp website field
    website: {
      type: String,
      // Validate URL format
      match: [
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    // Bootcamp phone field
    phone: {
      type: String,
      maxlength: [20, "Phone number cannot be longer than 20 characters"], // Maximum length for phone number
    },
    // Bootcamp email field
    email: {
      type: String,
      // Validate email format
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    // Bootcamp address field
    address: {
      type: String,
      required: [true, "Please add an address"], // Address is required
    },
    // Bootcamp location field (GeoJSON Point)
    location: {
      type: {
        type: String,
        //required: true,
        enum: ["Point"], // Specify GeoJSON Point type
      },
      coordinates: {
        type: [Number], //Array of numbers
        //required: true,
        index: "2dsphere", // Create 2dsphere index for geospatial queries
      },
      formattedAddress: String, // Formatted address string
      street: String, // Street name
      city: String, // City name
      state: String, // State name
      zipcode: String, // Zip code
      country: String, // Country name
    },
    // Bootcamp careers field (Array of strings)
    careers: {
      type: [String], //Array of strings
      required: true, // Careers are required
      enum: [
        // Enumerate allowed career options
        "Web Development",
        "Mobile Development",
        "Frontend Development",
        "Backend Development",
        "Full Stack Web Development",
        "Programming Languages",
        "Software Development",
        "Computer Science",
        "UI/UX",
        "Data Science",
        "Business",
        "Project Management",
        "Data Analysis",
        "Cloud Engineering",
        "Cloud Computing",
        "Software Engineering",
        "Artificial Intelligence",
        "Machine Learning",
        "Big Data",
        "Game Development",
        "Robotics",
        "Coding for Kids",
        "Cybersecurity",
        "Network Engineering",
        "IT Support",
        "Data Visualization",
        "Data Engineering",
        "Predictive Analytics",
        "Game Design",
        "Digital Marketing",
        "IT Management",
        "Software Testing",
        "Cloud Architecture",
        "Data Modeling",
        "Network Administration",
        "Database Management",
        "Data Warehousing",
        "Other",
      ],
    },
    // Bootcamp averageRating field
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"], // Minimum rating value
      max: [10, "Rating cannot be more than 10"], // Maximum rating value
    },
    // Bootcamp averageCost field
    averageCost: Number, // Average cost of bootcamp
    // Bootcamp photo field
    photo: {
      type: String,
      default: "no-photo.jpg", // Default photo
    },
    // Bootcamp housing field
    housing: {
      type: Boolean,
      default: false, // Default value for housing
    },
    // Bootcamp jobAssistance field
    jobAssistance: {
      type: Boolean,
      default: false, // Default value for job assistance
    },
    // Bootcamp jobGuarantee field
    jobGuarantee: {
      type: Boolean,
      default: false, // Default value for job guarantee
    },
    // Bootcamp acceptGi field
    acceptGi: {
      type: Boolean,
      default: false, // Default value for GI acceptance
    },
    createdAt: {
      type: Date,
      default: Date.now, // Default creation date
    },
    // Bootcamp user field (reference to User model)
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Reference to User model
      required: true, // User is required
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create bootcamp slug from the name before saving
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true }); // Generate slug from name
  next();
});

// Geocode & create location field before saving bootcamp data
BootcampSchema.pre("save", async function (next) {
  // Geocode the address using the geocoder utility function
  const loc = await geocoder.geocode(this.address);
  // Set the location field with geocoded data
  this.location = {
    type: "Point", // Specify GeoJSON Point type
    coordinates: [loc[0].longitude, loc[0].latitude], // Longitude and latitude coordinates
    formattedAddress: loc[0].formattedAddress, // Formatted address string
    street: loc[0].streetName, // Street name
    city: loc[0].city, // City name
    state: loc[0].stateCode, // State code
    zipcode: loc[0].zipcode, // Zip code
    country: loc[0].countryCode, // Country code
  };

  // Do not save address in DB
  this.address = undefined;
  next(); // Proceed to the next middleware
});

// Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre("deleteOne", { document: true }, async function (next) {
  // Log a message indicating courses are being deleted from the bootcamp
  console.log(`Courses being deleted from bootcamp ${this._id}`);
  // Delete all courses associated with the bootcamp
  await mongoose.model("Course").deleteMany({ bootcamp: this._id });
  // Log a message indicating reviews are being deleted from the bootcamp
  console.log(`Reviews being deleted from bootcamp ${this._id}`);
  // Delete all reviews associated with the bootcamp
  await mongoose.model("Review").deleteMany({ bootcamp: this._id });
  next(); // Proceed to the next middleware
});

// Reverse populate with virtuals to retrieve courses associated with the bootcamp
BootcampSchema.virtual("courses", {
  ref: "Course", // Reference to the Course model
  localField: "_id", // Field in this model (Bootcamp) to match with foreignField
  foreignField: "bootcamp", // Field in the Course model to match with localField
  justOne: false, // Specify multiple documents (courses) can be populated
});

// Export the Bootcamp model
module.exports = mongoose.model("Bootcamp", BootcampSchema);
