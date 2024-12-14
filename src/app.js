const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

//Local Modules
const connectDB = require("./config/database");
const User = require("./models/user");

//Route
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

const app = express();

const PORT = process.env.PORT || 7777;

app.use(
  cors({
    origin: ["https://devsyncui.netlify.app/", "http://localhost:5173"],
    credentials: true,
  })
);
app.options("*", cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://devsyncui.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});


app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("database connected successfuly");
    try {
      app.listen(PORT, () => console.log(`server running on port ${PORT}`));
    } catch (error) {
      console.log("Failed to connect");
    }
  })
  .catch((err) => {
    console.log("database can not be connected");
  });
