const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");
//const Review = require("./models/Review");

// Connect to MongoDB database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`.red.bold);
    process.exit(1);
  }
};

// Read JSON files
const readJSONFiles = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// Import data into MongoDB
const importData = async () => {
  try {
    const bootcamps = readJSONFiles(`${__dirname}/_data/bootcamps.json`);
    const courses = readJSONFiles(`${__dirname}/_data/courses.json`);
    const users = readJSONFiles(`${__dirname}/_data/users.json`);
    //const reviews = readJSONFiles(`${__dirname}/_data/reviews.json`);

    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    //await Review.create(reviews);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(`Error importing data: ${err.message}`.red.bold);
    process.exit(1);
  }
};

// Delete data from MongoDB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    //await Review.deleteMany();

    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(`Error deleting data: ${err.message}`.red.bold);
    process.exit(1);
  }
};

// Run the data import or delete functions based on command line arguments
const processData = async () => {
  // Check if the command is for importing or deleting data
  if (process.argv[2] === "-i") {
    await importData();
  } else if (process.argv[2] === "-d") {
    await deleteData();
  } else {
    console.error(
      "Invalid command. Usage: node seeder -i (import) | -d (delete)"
    );
    process.exit(1);
  }
};

// Connect to database and process data
connectDB();
processData();
