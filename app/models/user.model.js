const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: String,
    profile_picture: String,
    created_on: Date,
  })
);

module.exports = User;
