const validator = require("validator");
const bcrypt = require("bcrypt");

const signUpValidation = (req) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    about,
    skills,
    photoUrl,
    emailId,
    password,
  } = req.body;

  if (!validator.isEmail(emailId)) throw new Error("Enter Valid Email");
  else if (!validator.isStrongPassword(password))
    throw new Error("Enter strong password");
  else if (photoUrl && !validator.isURL(photoUrl))
    throw new Error("Enter valid PhotoURL");

  return {
    firstName,
    lastName,
    age,
    gender,
    about,
    skills,
    photoUrl,
    emailId,
    password,
  };
};

const loginInValidation = (req) => {
  const { emailId, password } = req.body;

  if (!validator.isEmail(emailId)) throw new Error("Invalid Crediantials");

  return {
    emailId,
    password,
  };
};

const validateEditProfileData = (req) => {
  const editableFields = [
    "firstName",
    "lastName",
    "about",
    "gender",
    "age",
    "photoUrl",
    "skills",
  ];

  const isEditable = Object.keys(req.body).every((field) => {
    return editableFields.includes(field);
  });

  return isEditable;
};

const validateChangePassword = async (req) => {
  const { password } = req.body;

  if(!validator.isStrongPassword(password)){
    throw new Error('Enter valid password')
  }
  

};

module.exports = {
  signUpValidation,
  loginInValidation,
  validateEditProfileData,
  validateChangePassword,
};
