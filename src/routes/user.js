const express = require("express");
const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "gender",
  "skills",
  "age",
  "about",
  "photoUrl",
  "designation",
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

    // console.log(connectionRequests);

    const data = connectionRequests.map((item) => {
      if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return item.toUserId;
      }
      return item.fromUserId;
    });

    res.send({ status: 200, data: data });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFeed = new Set();

    connectionRequests.forEach((connection) => {
      hideUsersFeed.add(connection.fromUserId.toString());
      hideUsersFeed.add(connection.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: Array.from(users) });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//OPEN ROUTES
userRouter.get("/user/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) throw new Error("No User With Provided Id");
    const {
      firstName,
      lastName,
      age,
      about,
      role,
      skills,
      designation,
      photoUrl,
      gender,
      createdAt,
      _id,
    } = user;

    const fromUserIdConnection = await ConnectionRequest.findOne({
      fromUserId: req.user._id,
      toUserId: id,
    });
    const toUserIdConnection = await ConnectionRequest.findOne({
      fromUserId: id,
      toUserId: req.user._id,
    });

    let relationship = "none";
    if (fromUserIdConnection) {
      relationship =
        fromUserIdConnection.status !== "accepted"
          ? "pending"
          : fromUserIdConnection.status; //intrested, accepted, ignored
    } else if (toUserIdConnection) {
      relationship =
        toUserIdConnection.status !== "accepted"
          ? "intrested"
          : toUserIdConnection.status; //intrested, accepted, ignored
    }

    res.send({
      data: {
        firstName,
        lastName,
        age,
        about,
        role,
        skills,
        designation,
        photoUrl,
        gender,
        relationship,
        createdAt,
        _id,
      },
    });
  } catch (error) {
    res.send({ message: "Error Occured" });
  }
});

module.exports = userRouter;
