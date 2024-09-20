const validator = require("validator");

const validateSignUpApi = (req) => {
  const { firstName, lastName, emailId, password, gender, age } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter strong password");
  }
};

const validateLoginApi = (req)=>{
    const {emailId} = req.body

    if(!validator.isEmail(emailId)){
        throw new Error('Enter Valid EmailId')
    }
    
}


module.exports = {validateSignUpApi, validateLoginApi}