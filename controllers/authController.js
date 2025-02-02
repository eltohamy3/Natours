const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/APIFeatures");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    email: req.body.email,
  });
  const token = newUser.generateAuthToken();
  res.status(201).json({
    status: "success",
    token: token,
    data: {
      user: newUser,
    },
  });
});



exports.login = catchAsync(async (req, res, next) => {
  // first check if the email and the password exist in the body
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Email and Password must be exist", 400));
  }
  // 2) check if the  password and the email is correct
  const user = await User.findOne({
    email: email,
  }).select("+password");

  if (!user || !( await user.ComparePassword(password, user.password))) {
    return next(new AppError("email or password is  incorrect" , 401) );
  }
  // 3 ) send the token to the user since it login successfully
  
  const token = user.generateAuthToken();
  res.status(201).json({
    status: "success",
    token: token,
  });
});
