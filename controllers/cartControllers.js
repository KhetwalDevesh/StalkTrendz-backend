const Cart = require("../models/cartModel");

exports.getServerCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.findOne({ user: req.user });
    res.send(cartItems);
  } catch (error) {
    res.send(error.message);
  }
};

exports.addItemToServerCart = async (req, res) => {
  try {
    const user = req.user;
    const item = {
      product: req.body,
      quantity: req.body.quantity,
    };
    const foundUser = await Cart.findOne({ user: user });
    if (!foundUser) {
      await Cart.create({ user: user, items: [item] });
      res.json({ msg: "cart created successfully" });
    } else {
      let currentItemInUserCart = foundUser.items.find(
        (cartItem) => cartItem.product == req.body._id
      );
      if (currentItemInUserCart) {
        currentItemInUserCart.quantity =
          currentItemInUserCart.quantity + req.body.quantity;
        foundUser.save();
        res.send(foundUser);
      } else {
        foundUser.items = [...foundUser.items, item];
        foundUser.save();
        res.send(foundUser);
      }
    }
  } catch (error) {
    res.send(error.message);
  }
};

exports.increaseItemQuantityInServerCart = async (req, res) => {
  try {
    const user = req.user;
    // console.log("req.body", JSON.stringify(req.body, null, 2));
    const foundUser = await Cart.findOne({ user: user });
    const currentItemInUserCart = foundUser.items.find((cartItem) => {
      //   console.log(
      //     "cartItem.product",
      //     JSON.stringify(cartItem.product, null, 2)
      //   );
      return cartItem.product == req.body._id;
    });
    currentItemInUserCart.quantity = currentItemInUserCart.quantity + 1;
    foundUser.save();
    res.send(foundUser);
  } catch (error) {
    res.send(error);
  }
};

exports.decreaseItemQuantityInServerCart = async (req, res) => {
  try {
    const user = req.user;
    // console.log("req.body", JSON.stringify(req.body, null, 2));
    const foundUser = await Cart.findOne({ user: user });
    const currentItemInUserCart = foundUser.items.find((cartItem) => {
      //   console.log(
      //     "cartItem.product",
      //     JSON.stringify(cartItem.product, null, 2)
      //   );
      return cartItem.product == req.body._id;
    });
    if (currentItemInUserCart.quantity == 1) {
      foundUser.items.pull(currentItemInUserCart);
    } else {
      currentItemInUserCart.quantity = currentItemInUserCart.quantity - 1;
    }
    foundUser.save();
    res.send(currentItemInUserCart);
  } catch (error) {
    res.send(error);
  }
};

exports.removeItemFromServerCart = async (req, res) => {
  try {
    const user = req.user;
    const foundUser = await Cart.findOne({ user: user });
    const currentItemInUserCart = foundUser.items.find((cartItem) => {
      return cartItem.product == req.body._id;
    });

    foundUser.items.pull(currentItemInUserCart);
    foundUser.save();
    res.send(foundUser);
  } catch (error) {
    res.send(error);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.params.id });
    res.json({ msg: "deleted cart successfully" });
  } catch (error) {
    res.send(error.message);
  }
};
