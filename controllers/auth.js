const asyncAwaitHandler = require("../middlewares/asyncAwait");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
// Controller for registering a new user
exports.register = asyncAwaitHandler(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body; // Destructure user input from request body

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Generate email confirmation token
    const confirmEmailToken = user.generateEmailConfirmToken();
    // Construct email confirmation URL
    const confirmEmailURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/confirmEmail?token=${confirmEmailToken}`;

    // Construct email message
    const message = `  Dear ${name},

      Thank you for registering. Please confirm your email address by clicking the link below:

      ${confirmEmailURL}

      If you did not request this registration, please ignore this email.

      Best regards,
      The Team`;

    //Construct html message
    const html = ` <p>Dear ${name},</p>
      <p>Thank you for registering. Please confirm your email address by clicking the link below:</p>
      <a href="${confirmEmailURL}">${confirmEmailURL}</a>
      <p>If you did not request this registration, please ignore this email.</p>
      <p>Best regards,<br/>The Team</p>`;

    try {
      // Save user without validating before saving
      await user.save({ validateBeforeSave: false });

      // Send confirmation email
      await sendEmail({
        email: user.email,
        subject: "Email Confirmation Required",
        message,
        html,
      });

      // Send token response to client
      sendTokenResponse(
        user,
        200,
        res,
        "Registration successful. Please check your email to confirm your account."
      );
    } catch (emailError) {
      // If sending email fails, delete the user and return error
      await User.findByIdAndDelete(user._id);
      return next(
        new ErrorResponse(
          "There was an error sending the email. Please try again later.",
          500
        )
      );
    }
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
// Controller for user login
exports.login = asyncAwaitHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body; // Destructure email and password from request body

    // Validate email and password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    // Find user by email and select password field
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    // Send token response to client
    sendTokenResponse(user, 200, res, "Login successful");
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
// Controller for logging out user and clearing cookie
exports.logout = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Set cookie to 'none' with an expiration time of 5 seconds
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true, // Cookie accessible only via HTTP(S) protocol
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    // Send success response with empty data object
    res.status(200).json({
      success: true,
      status: true,
      message: "User logged out successfully",
      data: {},
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/currentUser
// @access    Private
// Controller for fetching current logged in user
exports.getCurrentLoginUser = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Retrieve user from request object (set by protect middleware)
    const user = req.user;

    // Send success response with user data
    res.status(200).json({
      success: true,
      status: true,
      message: "Current authenticated user retrieved successfully",
      data: user,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updateDetails
// @access    Private
// Controller for updating user details
exports.updateDetails = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Validate presence of name and email in request body
    if (!req.body.name || !req.body.email) {
      throw new ErrorResponse("Please provide both name and email", 400);
    }

    // Extract fields to update from request body
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    // Find user by ID and update details
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true, // Return updated user
      runValidators: true, // Run model validators
      context: "query", // Ensure validation runs in query context
    });

    // Check if user exists after update
    if (!user) {
      throw new ErrorResponse("User not found", 404);
    }

    // Send success response with updated user data
    res.status(200).json({
      success: true,
      status: true,
      message: "User details updated successfully",
      data: user,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatePassword
// @access    Private
// Controller for updating user password
exports.updatePassword = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Validate presence of current and new passwords in request body
    if (!req.body.currentPassword || !req.body.newPassword) {
      throw new ErrorResponse(
        "Please provide both current and new passwords",
        400
      );
    }

    // Find user by ID and select password field
    const user = await User.findById(req.user.id).select("+password");

    // Check if current password matches
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      throw new ErrorResponse("Password is incorrect", 401);
    }

    // Set new password
    user.password = req.body.newPassword;

    // Save updated user
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res, "Password updated successfully");
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
// Controller for handling forgot password functionality
exports.forgotPassword = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    // If user does not exist, return error
    if (!user) {
      return next(new ErrorResponse("There is no user with that email", 404));
    }

    // Generate reset token and save user
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetPassword/${resetToken}`;

    // Construct email message
    const message = `Dear ${user.name},

      You are receiving this email because a request has been made to reset the password for your account. If you did not make this request, please ignore this email.

      To reset your password, please make a PUT request to the following URL:

      ${resetUrl}

      This link will expire in 10 minutes. If you need further assistance, please contact our support team.

      Best regards,
      Your Company Name`;

    // Construct HTML message
    const html = `<p>Dear ${user.name},</p>
      <p>You are receiving this email because a request has been made to reset the password for your account. If you did not make this request, please ignore this email.</p>
      <p>To reset your password, please make a PUT request to the following URL:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 10 minutes. If you need further assistance, please contact our support team.</p>
      <p>Best regards,<br>Your Company Name</p>`;

    try {
      // Send password reset email
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token Request",
        message,
        html,
      });

      // Send success response
      res.status(200).json({ success: true, status: true, data: "Email sent" });
    } catch (emailError) {
      console.error(emailError);
      // Reset user token and expiration if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      // Save user
      await user.save({ validateBeforeSave: false });
      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    // Return error response
    console.error(error);
    next(error);
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetPassword/:resetToken
// @access    Public
// Controller for resetting user password
exports.resetPassword = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    // Find user by reset token and ensure token has not expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    // If user not found or token expired, return error
    if (!user) {
      return next(new ErrorResponse("Invalid token or token has expired", 400));
    }

    // Set new password and clear reset token and expiration
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res, "Password reset successful");
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Return error response
    next(new ErrorResponse("Failed to reset password", 500));
  }
});

/**
 * @desc    Confirm Email
 * @route   GET /api/v1/auth/confirmEmail
 * @access  Public
 * Controller for confirming user email
 */
exports.confirmEmail = asyncAwaitHandler(async (req, res, next) => {
  try {
    // Grab token from query parameter
    const { token } = req.query;

    // Check if token exists
    if (!token) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    // Extract token part before dot
    const splitToken = token.split(".")[0];
    const confirmEmailToken = crypto
      .createHash("sha256")
      .update(splitToken)
      .digest("hex");

    // Find user by confirmation token and ensure email not already confirmed
    const user = await User.findOne({
      confirmEmailToken,
      isEmailConfirmed: false,
    });

    // If user not found or email already confirmed, return error
    if (!user) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    // Update user's email confirmation status
    user.confirmEmailToken = undefined;
    user.isEmailConfirmed = true;

    // Save user changes
    await user.save({ validateBeforeSave: false });

    // Return token response
    sendTokenResponse(user, 200, res, "Email confirmed successfully.");
  } catch (error) {
    // Handle errors
    console.error(error);
    return next(new ErrorResponse("Confirm email failed", 500));
  }
});

/**
 * @desc    Send Two-Factor Authentication Code
 * @route   POST /api/v1/auth/sendTwoFactorCode
 * @access  Private
 * Controller to generate and send two-factor authentication code to the user
 */
exports.sendTwoFactorCode = asyncAwaitHandler(async (req, res, next) => {
  try {
    const user = req.user; // Get the authenticated user

    // Generate the two-factor code
    const twoFactorCode = user.generateTwoFactorCode();

    // Save the user with the new two-factor code and expiration time
    await user.save({ validateBeforeSave: false });

    // Send the code to the user (e.g., via email)
    const message = `Dear ${user.name},\n\nYour two-factor      authentication code is: ${twoFactorCode}\n\nPlease use this code to complete your login. This code will expire in 10 minutes.\n\nIf you did not request this code, please contact our support team immediately.\n\nBest regards,\nYour Company Name`;

    // Construct the HTML message
    const html = `
      <p>Dear ${user.name},</p>
      <p>Your two-factor authentication code is: <strong>${twoFactorCode}</strong></p>
      <p>Please use this code to complete your login. This code will expire in 10 minutes.</p>
      <p>If you did not request this code, please contact our support team immediately.</p>
      <p>Best regards,<br>Your Company Name</p>
    `;

    // Send the code to the user via email
    await sendEmail({
      email: user.email,
      subject: "Your Two-Factor Authentication Code",
      message,
      html,
    });

    // Send a success response
    res.status(200).json({
      success: true,
      status: true,
      message: "Two-factor authentication code sent successfully",
    });
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
});

/**
 * @desc    Verify Two-Factor Authentication Code
 * @route   POST /api/v1/auth/verifyTwoFactorCode
 * @access  Private
 * Controller for verifying the two-factor authentication code
 */
exports.verifyTwoFactorCode = asyncAwaitHandler(async (req, res, next) => {
  try {
    const { code } = req.body; // Get the entered code from the request body
    const user = req.user; // Get the authenticated user

    // Verify the code
    if (!user.verifyTwoFactorCode(code)) {
      return next(new ErrorResponse("Invalid or expired two-factor code", 400));
    }

    // Send a success response
    res.status(200).json({
      success: true,
      status: true,
      message: "Two-factor authentication code verified successfully",
    });
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
});

/**
 * Get token from model, create cookie and send response
 * @param {Object} user The user object
 * @param {number} statusCode The status code for the response
 * @param {Object} res The response object
 */
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Set cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Secure cookie in production
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  // Send response with token in cookie
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    status: true,
    message: message,
    token,
  });
};
