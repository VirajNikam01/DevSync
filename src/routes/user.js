const express = require("express");
const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "gender",
  "skills",
  "age",
  "about",
  "photoUrl",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connsctionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.send({ status: 200, data: connsctionRequests });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((item) => {
      if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return item.fromUserId;
      }
      return item.toUserId;
    });

    res.send({ status: 200, data: data });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = userRouter;
