const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Crediantials");
    }

    const decoded = await jwt.verify(token, "DevTinder@909");
    const { _id } = decoded;

    const user = await User.findOne({ _id });
    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user
    next()
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
};

module.exports = {  userAuth };
