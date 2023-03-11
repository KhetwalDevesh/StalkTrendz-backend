const Order = require("../models/orderModel");
const dotenv = require("dotenv");
const { response } = require("express");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (orderItems) => {
  const totalAmount = orderItems.reduce(
    (amount, item) => amount + item.price * item.quantity,
    0
  );
  return totalAmount;
};

exports.createOrder = async (req, res) => {
  try {
    const { user, deliveryAddress, orderStatus, orderItems } = req.body;
    console.log("orderItems", JSON.stringify(orderItems, null, 2));
    const orderAmount = calculateOrderAmount(orderItems);
    console.log("orderAmount", JSON.stringify(orderAmount, null, 2));
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: "inr",
    });
    console.log(
      `paymentIntent in create order`,
      JSON.stringify(paymentIntent, null, 2)
    );
    const paymentIntentId = paymentIntent.id;
    const order = await Order.create({
      user,
      deliveryAddress,
      orderItems,
      orderAmount,
      orderStatus,
      paymentIntentId,
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      orderItems,
      deliveryAddress,
      user,
      orderAmount,
    });
  } catch (error) {
    console.log("error in createOrder", error);
    res.send("Something went wrong while creating order");
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.send(orders);
  } catch (error) {
    console.log("error in getOrders", error);
    res.send("Something went wrong in getOrders");
  }
};

exports.deleteAllOrders = async (req, res) => {
  try {
    const orders = await Order.deleteMany({});
    res.send("all orders deleted successfully");
  } catch (error) {}
};
