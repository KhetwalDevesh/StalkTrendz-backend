const Product = require("../models/productModel.js");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.log(error.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404);
      console.log("Product not found");
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: "Product removed" });
    } else {
      res.status(404);
      console.log("Product not found");
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = Product.create(req.body);
    res.json({ success: true, msg: product });
  } catch (error) {
    console.log(error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    product = req.body;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.log(error.message);
  }
};
