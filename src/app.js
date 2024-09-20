const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/database");
const User = require("./models/user");

const { validateSignUpApi, validateLoginApi } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

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
    const ALLOWED_UPDATES = [
      "age",
      "firstName",
      "lastName",
      "about",
      "photoURL",
      "gender",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    const isLimitedSkills = data?.skills?.length < 10;

    if (!isUpdateAllowed || !isLimitedSkills) {
      throw new Error("Cannot Update Fields");
    }
    await User.findOneAndUpdate({ firstName: userFirstName }, data, {
      runValidators: true,
    });
    res.send("user Updated successfully!");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//POST user API
app.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      photoURL,
      gender,
      about,
      skills,
    } = req.body;
    //validation
    validateSignUpApi(req);

    //password encryption
    const passwordHash = await bcrypt.hash(password, 10);

    //creating instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      photoURL,
      gender,
      about,
      skills,
    });
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    res.status(400).send("failed to save user" + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;
    //Validate
    validateLoginApi(req);
    //check password
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Crediantials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid Crediantials");
    } else {
      //Generte the JWT token
      const tokenJWT = jwt.sign({ _id: user._id }, "DevTinder@909", {
        expiresIn: "1d",
      });

      res.cookie("token", tokenJWT, {
        expires: new Date(Date.now() + 10*1000),
      });
      res.send("User Logedin Successfull!");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  } 
});

app.get("/profile", [userAuth], async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
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
