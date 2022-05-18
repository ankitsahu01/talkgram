const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  registerUser,
  searchUsers,
  searchAvailableUsername,
  loginUser,
  insertNotification,
  fetchNotifications,
  removeNotification,
  isEmailExist,
  resetPassword,
  changePassword,
} = require("../controllers/userControllers");

router.route("/").post(registerUser).get(auth, searchUsers);
router.route("/search-available-username").get(searchAvailableUsername);
router.route("/is-email-exist").post(isEmailExist);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);
router.route("/change-password").post(auth, changePassword);
router
  .route("/notification")
  .get(auth, fetchNotifications)
  .post(auth, insertNotification)
  .delete(auth, removeNotification);

module.exports = router;
