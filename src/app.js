const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

//Get user API
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findById({ _id: userEmail });
    if (users.length === 0) res.status(404).send("User not found");
    else res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//Get feed API
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) res.status(404).send("No users found");
    else res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

//DELETE user API
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//Update user API
app.patch("/user", async (req, res) => {
  const userFirstName = req.body.firstName;
  const data = req.body;
  try {
    await User.findOneAndUpdate({ firstName: userFirstName }, data);
    res.send("user Updated successfully!");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//POST user API
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    res.status(400).send("failed to save user");
  }
});

connectDB()
  .then(() => {
    console.log("database connected successfuly");
    app.listen(7777, () => console.log("server running on port 7777"));
  })
  .catch((err) => {
    console.log("database can not be connected");
  });
