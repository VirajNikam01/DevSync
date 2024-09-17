const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello from Dashboard");
});

app.use("/hello", (req, res) => {
  res.send("Hello from server");
});

app.listen(7777, () => console.log("server running on port 7777"));
