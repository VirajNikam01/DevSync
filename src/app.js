const express = require("express");
const cookieParser = require("cookie-parser");

//Local Modules
const connectDB = require("./config/database");
const User = require("./models/user");

//Route
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("database connected successfuly");
    app.listen(7777, () => console.log("server running on port 7777"));
  })
  .catch((err) => {
    console.log("database can not be connected");
  });
