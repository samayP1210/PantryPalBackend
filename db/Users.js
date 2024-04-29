const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide Username."],
  },
  password: {
    type: String,
    required: [true, "Please Provide Password."],
  },
  email: {
    type: String,
    required: [true, "Please provide user email."],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  }
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(5);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username, email: this.email },
    process.env.JWT_SECREt_KEY,
    { expiresIn: "28d" }
  );
};

module.exports = mongoose.model("Users", UserSchema);
