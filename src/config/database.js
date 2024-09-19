const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:VFUpmaOK5PDfGL4T@namastenode.dwh5n.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
