const mongoose = require("mongoose");
require('dotenv').config({ path: '../.env' });

const MONGO_VG_URI = process.env.MONGO_VG_URI;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_VG_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed");
      console.error(error);
      process.exit(1);
    });
};