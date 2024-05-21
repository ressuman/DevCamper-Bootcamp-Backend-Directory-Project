const express = require("express");
const {
  register,
  login,
  getCurrentLoginUser,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/currentUser", protect, getCurrentLoginUser);

router.put("/updateDetails", protect, updateDetails);

router.put("/updatePassword", protect, updatePassword);

router.post("/forgotPassword", forgotPassword);

router.put("/resetPassword/:resetToken", resetPassword);

module.exports = router;
