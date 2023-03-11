const User = require("../models/userModel.js");
const generateToken = require("../utils/generateToken.js");
const validator = require("validator");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.json(error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    if (!username || !email || !password) {
      throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }
    const usernameExists = await User.findOne({ username });
    const userEmailExists = await User.findOne({ email });
    if (usernameExists || userEmailExists) {
      res.status(400).send("User already exists");
    } else {
      const user = await User.create(req.body);
      if (user) {
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).send("Invalid user data");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ msg: "User removed" });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.json(error.message);
  }
};

exports.authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isCorrectPassword = await user.matchPassword(password);
      if (isCorrectPassword) {
        res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ success: false, msg: "Incorrect password!" });
      }
    } else {
      res.status(401).json({ success: false, msg: "Email not found!" });
    }
  } catch (error) {
    res.send(error.message);
  }
};
