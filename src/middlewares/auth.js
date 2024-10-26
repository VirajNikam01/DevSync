const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("please logIn");
    // Verify the token
    const decoded = await jwt.verify(token, process.env.PRIVATE_KEY); 
    const { _id } = decoded;

    // get the data from DB
    const user = await User.findOne({ _id });
    if (!user) throw new Error("User doesnt exist");
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = { userAuth };
