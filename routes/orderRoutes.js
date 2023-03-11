const {
  getOrders,
  createOrder,
  deleteAllOrders,
} = require("../controllers/orderControllers");
const express = require("express");
const router = express.Router();

router.route("/").get(getOrders);
router.route("/").post(createOrder);
router.route("/").delete(deleteAllOrders);

module.exports = router;
