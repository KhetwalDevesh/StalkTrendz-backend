const express = require("express");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const connectDB = require("./config/db.js");
const colors = require("colors");
const cors = require("cors");
const bodyParser = require("body-parser");
const Order = require("./models/orderModel");
dotenv.config();
connectDB();
const app = express();
app.use(cors());
// app.use(
//   express.json({
//     limit: "5mb",
//     verify: (req, res, buf) => {
//       req.rawBody = buf.toString();
//     },
//   })
// );

// app.use("/checkout/webhook", );
const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);
const endpointSecret =
  "whsec_7847e6bd056f1e0ef6521e4b161f91912a0caad833a13bf67c8c385aa17f5fab";
app.post(
  "/webhook",
  express.raw({ type: "*/*" }),
  async (request, response) => {
    try {
      const sig = request.headers["stripe-signature"];
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
        console.log("webhook verified");
        console.log("event", JSON.stringify(event, null, 2));
      } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      console.log("event.type", JSON.stringify(event.type, null, 2));
      // Handle the event
      switch (event.type) {
        case "charge.succeeded":
          const chargeSucceeded = event.data.object;
          console.log("charge succeeded", { chargeSucceeded });
          await Order.updateOne(
            {
              paymentIntentId: chargeSucceeded.payment_intent,
            },
            {
              paymentDetails: chargeSucceeded,
              orderStatus: "succeeded",
            }
          );
          break;
        case "payment_intent.succeeded":
          const paymentIntentSucceeded = event.data.object;
          console.log("payment intent succeeded", { paymentIntentSucceeded });
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {}
  }
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
