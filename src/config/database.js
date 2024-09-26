const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_ATLAS_DATABASE_URL);
};

module.exports = connectDB;
