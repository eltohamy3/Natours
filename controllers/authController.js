const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/APIFeatures");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const sendEmail = require("./../utils/email");
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
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.generatePasswordResetToken();
  console.log({ resetToken });

  // 3) Save the changes
  await user.save({ validateBeforeSave: false });

  // 4) Send email with reset link
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: 
  ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  const options = {
    email: user.email,
    subject: "Your password reset token (valid for 10 min)",
    message: message,
  };
  console.log(options);

  try {
    console.log("heare befor sending ");
    await sendEmail(options);
    console.log("heare after sending ");
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error while sending the email. Try again later!",
        500,
      ),
    );
  }
});

exports.resetPassword = (req, res, next) => {};
