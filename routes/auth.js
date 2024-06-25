const express = require("express");
const {
  register,
  login,
  getCurrentLoginUser,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
  confirmEmail,
  sendTwoFactorCode,
  verifyTwoFactorCode,
} = require("../controllers/auth"); // Import authentication controllers

const { protect } = require("../middlewares/auth"); // Import middleware for authentication

const router = express.Router(); // Create a new express router instance

// @route     POST /api/v1/auth/register
// @desc      Register a new user
// @access    Public
router.post("/register", register); // Public route for user registration

// @route     POST /api/v1/auth/login
// @desc      Log in a user
// @access    Public
router.post("/login", login); // Public route for user login

// @route     GET /api/v1/auth/logout
// @desc      Log out a user
// @access    Private
router.get("/logout", logout); // Private route for user logout

// @route     GET /api/v1/auth/currentUser
// @desc      Get current logged in user details
// @access    Private
router.get("/currentUser", protect, getCurrentLoginUser); // Private route to get current logged-in user details

// @route     PUT /api/v1/auth/updateDetails
// @desc      Update user details
// @access    Private
router.put("/updateDetails", protect, updateDetails); // Private route to update user details

// @route     PUT /api/v1/auth/updatePassword
// @desc      Update user password
// @access    Private
router.put("/updatePassword", protect, updatePassword); // Private route to update user password

// @route     POST /api/v1/auth/forgotPassword
// @desc      Forgot password
// @access    Public
router.post("/forgotPassword", forgotPassword); // Public route to handle forgot password

// @route     PUT /api/v1/auth/resetPassword/:resetToken
// @desc      Reset password
// @access    Public
router.put("/resetPassword/:resetToken", resetPassword); // Public route to reset password using a token

// @route     GET /api/v1/auth/confirmEmail
// @desc      Confirm user email
// @access    Public
router.get("/confirmEmail", confirmEmail); // Public route to confirm user email

// Protect these routes to ensure they are only accessible to authenticated users
router.post("/sendTwoFactorCode", protect, sendTwoFactorCode);
router.post("/verifyTwoFactorCode", protect, verifyTwoFactorCode);

module.exports = router; // Export the router
