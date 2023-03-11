const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.stripeCheckout = async (req, res) => {
  try {
    console.log("req.body", JSON.stringify(req.body.serverCartItems, null, 2));
    console.log("req.body", JSON.stringify(req.body, null, 2));
    let line_items_array = [];
    req.body.serverCartItems.map((cartItem) => {
      const new_line_item = {
        price_data: {
          currency: "inr",
          product_data: {
            name: cartItem.name,
          },
          unit_amount: cartItem.price * 100,
        },
        quantity: cartItem.quantity,
      };
      line_items_array = [...line_items_array, new_line_item];
    });
    const session = await stripe.checkout.sessions.create({
      line_items: line_items_array,
      mode: "payment",
      success_url: `http://localhost:5173/success`,
      cancel_url: `http://localhost:${process.env.PORT}/cancel`,
    });
    res.send(session);
    console.log("session.url", JSON.stringify(session.url, null, 2));
  } catch (error) {
    console.log(error);
  }
};
