const { StatusCodes } = require("http-status-codes");
const User = require("../db/Users");
const Item = require("../db/Items");
const MealPlans = require("../db/MealPlans");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res, next) => {
  // console.log(req.body)
  const { email, username, password } = req.body;

  try {
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failed",
        msg: "Email Already Exists",
      });
    }
    // 662b6c22466f35b888c955d1
    const user = await User.create({ email, username, password });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
      status: "success",
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "failed",
      msg: "Invalid Email",
    });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "failed",
      msg: "Invalid Password",
    });
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    status: "success",
    token,
    userId: user._id,
    username: user.username,
    email: user.email,
  });
};

const getUser = async (req, res, next) => {
  try {
    const { userId, username, email } = req.user;
    res
      .status(StatusCodes.OK)
      .json({ status: "success", userId, username, email });
  } catch (Err) {
    next(Err);
  }
};

const deleteUser = async (req, res, next) => {
  const { password } = req.body;
  const { userId } = req.user;
  try {
    if (!password) {
      throw new Error("Incorrect Password");
    }
    const user = await User.findOne({ _id: userId });
    // console.log(user);
    if (!user) throw new Error("No user found");

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new Error("Incorrect Password");

    await User.findOneAndDelete({ _id: userId });
    await Item.deleteMany({ userId });
    const meals = await MealPlans.deleteMany({ userId });

    res.status(StatusCodes.OK).json({ status: "success", meals });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.user;

    if (!currentPassword) throw new Error("Enter Current Password");
    if (!newPassword) throw new Error("Enter New Password");
    if (currentPassword === newPassword)
      throw new Error("New Password Cannot be same as old");

    const user = await User.findOne({ _id: userId });
    if (!user) throw new Error("No user found");

    const isPasswordMatched = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordMatched) throw new Error("Incorrect Password");

    user.password = newPassword;
    user.save();
    res
      .status(StatusCodes.OK)
      .json({ status: "success", msg: "Password Changed" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
  changePassword,
};
