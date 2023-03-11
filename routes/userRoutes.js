const express = require("express");
const {
  getUsers,
  registerUser,
  getUserById,
  deleteUser,
  authUser,
} = require("../controllers/userControllers.js");
const { protect } = require("../middleware/authmiddleware.js");
const router = express.Router();

router.route("/").get(getUsers);
router.route("/:id").get(getUserById).delete(deleteUser);
router.route("/register").post(registerUser);
router.route("/login").post(authUser);

module.exports = router;
