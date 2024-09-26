const express = require("express");
const bcrypt = require('bcrypt')
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateChangePassword,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res, next) => {
  const user = req.user;
  // send the data in response
  res.send(user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  // validate data
  if (!validateEditProfileData(req)) {
    throw new Error("Failed ! not all fields are editable");
  }
  // store data in DB
  const loggedInUser = req.user;
  const updateDataRequest = req.body;

  Object.keys(updateDataRequest).forEach((field) => {
    loggedInUser[field] = updateDataRequest[field];
  });
  loggedInUser.save();

  res.send({
    message: `${loggedInUser.firstName}, your profile updated!`,
    data: loggedInUser,
  });
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  // validate data compare with the password
  validateChangePassword(req);
  // save the updated hashPassword in db
  const loggedInUser = req.user;
  const token = await bcrypt.hash(req.body.password, 10);
  loggedInUser.password = token;
  loggedInUser.save();
  res.send({ message: "Password updated!" });
});

module.exports = profileRouter;
