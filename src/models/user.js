const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 25,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    about: {
      type: String,
    },
    age: {
      type: Number,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 20) throw new Error("Can store maximum 20 skills");
        value.forEach((data) => {
          if (data.length > 20) throw new Error("Enter valid skills");
        });
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Enter valid Age.");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1726510114046-b7938cdc1bd1?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1, lastName: 1 });

//Schema Methods
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY); 

  return token;
};

userSchema.methods.verifyPassword = async function (userEnteredPassword) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcrypt.compare(
    userEnteredPassword,
    passwordHash
  );

  return isValidPassword;
};

//Model
const User = mongoose.model("User", userSchema);

module.exports = User;
