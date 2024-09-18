const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth, (req, res) => {
  res.send("Admin pannel");
});

app.get("/admin/getData", adminAuth, (req, res) => {
  res.send("Completed the task");
});

app.get("/user", userAuth, (req, res) => {
  throw new Error("Some error");
  res.send("user pannel");
});


app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

app.listen(7777, () => console.log("server running on port 7777"));
