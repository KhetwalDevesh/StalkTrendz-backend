// const express = require("express");
// const { protect } = require("../middleware/authmiddleware");
// const router = express.Router();
// const { stripeCheckout } = require("../controllers/checkoutControllers");
// router.route("/stripeCheckout").post(stripeCheckout);
// module.exports = router;

// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
// endpointSecret = "whsec_7847e6bd056f1e0ef6521e4b161f91912a0caad833a13bf67c8c385aa17f5fab";

module.exports = router;
// app.listen(4242, () => console.log("Running on port 4242"));
