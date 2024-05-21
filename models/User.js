const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"], // Require a name field
  },
  email: {
    type: String,
    required: [true, "Please add an email"], // Require an email field
    unique: true, // Ensure email uniqueness
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email", // Validate email format
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher"], // Define user roles as 'user' or 'publisher'
    default: "user", // Default role is 'user'
  },
  password: {
    type: String,
    required: [true, "Please add a password"], // Require a password field
    minlength: 6, // Set minimum password length to 6 characters
    select: false, // Hide password field from query results
  },
  resetPasswordToken: String, // Token for resetting password
  resetPasswordExpire: Date, // Expiration time for reset password token
  // confirmEmailToken: String, // Token for confirming email address
  // isEmailConfirmed: {
  //   type: Boolean,
  //   default: false, // Default email confirmation status is false
  // },
  // twoFactorCode: String, // Two-factor authentication code
  // twoFactorCodeExpire: Date, // Expiration time for two-factor authentication code
  // twoFactorEnable: {
  //   type: Boolean,
  //   default: false, // Default two-factor authentication status is false
  // },
  createdAt: {
    type: Date,
    default: Date.now, // Set default creation date to current timestamp
  },
});

// Encrypt password using bcryptJS before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // Skip if password is not modified
    return next();
  }

  const salt = await bcrypt.genSalt(10); // Generate salt with cost factor 10
  this.password = await bcrypt.hash(this.password, salt); // Hash password with generated salt
  next();
});

// // Encrypt password using bcrypt while updating (admin)
// UserSchema.pre('findOneAndUpdate', async function (next) {
//   if (this._update.password) {
//     // If password is being updated
//     this._update.password = await bcrypt.hash(this._update.password, 10); // Hash updated password
//   }
//   next();
// });

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    // Sign JWT with user's ID and secret key, setting expiration time
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with hashed password
};

// Generate and hash reset password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set expiration time
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Set expiration to 10 minutes from now

  return resetToken;
};

// // Generate email confirm token
// UserSchema.methods.generateEmailConfirmToken = function () {
//   // Generate random token
//   const confirmationToken = crypto.randomBytes(20).toString('hex');

//   // Combine with extended token for security
//   const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
//   const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;

//   // Hash token and set to confirmEmailToken field
//   this.confirmEmailToken = crypto
//     .createHash('sha256')
//     .update(confirmTokenCombined)
//     .digest('hex');

//   return confirmTokenCombined; // Return combined token
// };

// Export the User model
module.exports = mongoose.model("User", UserSchema);
