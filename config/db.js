const mongoose = require("mongoose");
const { cyan, underline, bold, red } = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB Connected: ${conn.connection.host}`.rainbow.underline.bold
        .bgBrightWhite
    );
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`.red.bold);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
