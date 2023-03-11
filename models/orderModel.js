const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      email: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    deliveryAddress: {
      address: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          //required: true,
          ref: "Product",
        },
      },
    ],
    orderAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
