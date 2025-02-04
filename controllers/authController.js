const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/APIFeatures");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

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

  if (!user || !(await user.ComparePassword(password, user.password))) {
    return next(new AppError("email or password is  incorrect", 401));
  }
  // 3 ) send the token to the user since it login successfully

  const token = user.generateAuthToken();
  res.status(201).json({
    status: "success",
    token: token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  // distruct the body ;
  // 1) get the token and check of it's there

  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    // - get the token
    return next(
      new AppError("your are not log in! Please log in to get acccess.", 401),
    );
  }
  /// 2) verification token
  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const user = await User.findById(payload.id);

  if (!user)
    return next(
      new AppError(
        "the user  belonging to this token does no longer exist",
        401,
      ),
    );
  // 4) Check if user changed password after token was issued
  if (user.CheckPasswordChanged(payload.iat))
    return next(
      new AppError("User recently changed password ! please log in again", 401),
    );

  //  GRANt access the protected route
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  // roles is and array
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("you don't have permission to perform this action", 401),
      );

    /// if it  has the right to make this
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user baasede on posted emial
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user)
    return next(
      new AppError("There is no user with  email addresss.", 404),
    );


  // 2 ) generate the random rest token
    const resetToken = user.genratePasswordResetToken(); 
    console.log({resetToken}) ;
  // 3) send it to user's email
  await user.save(
   {
    validateBeforSave : false}
  ) ;

});
exports.resetPassword = (req, res, next) => {};
