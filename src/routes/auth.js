const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { signUpValidation, loginInValidation } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { password } = req.body;
    //Validation
    const data = signUpValidation(req);
    //Hash Password
    const passwordHash = await bcrypt.hash(password, 10);
    //Create instance of User model
    const user = new User({ ...data, password: passwordHash });
    await user.save();
    res.send({ message: "user registered" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    // Validation
    const { emailId, password } = loginInValidation(req);
    //get the user from DB
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("User not Found");
    // Compare Hash Pasword with PlainText Password
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) throw new Error("Invalid Crediantials");
    // Generate JWT Token
    const jwtToken = await user.getJWT();
    // Send Token In Cookie
    res.cookie("token", jwtToken);
    //send res
    res.send({ message: "Logged in Successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send({ message: "logged out successfully!" });
});

module.exports = authRouter;
