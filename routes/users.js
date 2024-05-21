const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const advancedQueryResults = require("../middlewares/advancedQueryResults");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const User = require("../models/User");

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(advancedQueryResults(User, "Users"), getUsers)
  .post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
