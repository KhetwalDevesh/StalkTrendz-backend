const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");
const {
  getServerCartItems,
  addItemToServerCart,
  increaseItemQuantityInServerCart,
  decreaseItemQuantityInServerCart,
  removeItemFromServerCart,
  deleteCart,
} = require("../controllers/cartControllers");

router
  .route("/")
  .get(protect, getServerCartItems)
  .post(protect, addItemToServerCart);

router.route("/increase").put(protect, increaseItemQuantityInServerCart);

router.route("/decrease").put(protect, decreaseItemQuantityInServerCart);

router.route("/remove").put(protect, removeItemFromServerCart);

router.route("/:id").delete(deleteCart);

module.exports = router;
