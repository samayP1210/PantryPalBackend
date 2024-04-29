const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
  changePassword,
} = require("../controller/userController");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/change-password").patch(authenticateUser, changePassword);
router
  .route("/")
  .get(authenticateUser, getUser)
  .delete(authenticateUser, deleteUser);

module.exports = router;
