const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      // sanitize the data
      const allowedStatus = ["intrested", "ignore"];
      const { status, userId } = req.params;
      const fromUserId = req.user._id;
      const toUserId = new mongoose.Types.ObjectId(userId);

      // check for valid status type.
      if (!allowedStatus.includes(status)) {
        throw new Error("invalid status type.");
      }

      // check if the toUserIdExists in Db
      const toUser = await User.findOne({ _id: toUserId });
      if (!toUser) {
        throw new Error(
          `${req.user.firstName}, the person u'r sending the request does no exist!`
        );
      }

      // check if the user has sent req already. or the end user has sent req to you.
      const existingUser = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingUser) {
        throw new Error("Request already sent!");
      }

      // store into db
      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const successData = await request.save();

      res.send({ status: 200, message: "Request sent!", data: request });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
);

//accept or reject request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      // check status
      const allowedStatus = ["accepted", "reject"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Enter valid status type");
      }
      // loggedIn user should be toUserId
      //status = intrested
      const connectionUser = await ConnectionRequest.findOne({
        toUserId: loggedInUser._id,
        _id: requestId,
        status: "intrested",
      });

      if (!connectionUser) {
        throw new Error("No request exists!");
      }

      connectionUser.status = status;
      const data = await connectionUser.save();

      res.send({
        status: 200,
        message: `${loggedInUser.firstName}, you ${status}, the request`,
      });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
);

module.exports = requestRouter;
