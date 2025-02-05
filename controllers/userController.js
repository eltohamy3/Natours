/* eslint-disable prettier/prettier */
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const APIFeatures = require("./../utils/APIFeatures");
const AppError = require("./../utils/appError");

const filterObj = (obj , ...allowedFields)=>{
  let newObj = {} ;
  Object.keys(obj).forEach( el =>{
    if (allowedFields.includes(el) && obj[el]){
      newObj[el]= obj[el] ;
    }
  }) ;
  return newObj ;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let userFeatures = new APIFeatures(User.find(), req.query)
    .filter()
    .sorting()
    .limitingFields();
  let users = await userFeatures.query;

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users: users,
    },
  });
});

exports.CreateUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      users: newUser,
    },
  });
});

exports.getUser = catchAsync(async (req, res) => {
  let userFeatures = new APIFeatures(
    User.findById(req.params.id),
    req.query,
  ).limitingFields();

  const user = await userFeatures.query;
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
});

// Update user by ID
exports.UpdateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
exports.DeleteUser = catchAsync(async (req, res, next) => {
  const deltedUser = await User.findByIdAndDelete(req.params.id);
  if (!deltedUser) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(500).json({
    status: "fail",
    message: "user not found",
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) throw error if tuser posts password data
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        "This route is not for Password Updates . Please use /updateMyPassword.",
        400,
      ),
    );

  /// 2 UPDATE THE  user document
  console.log(req.body) ;
  const updatedObject = filterObj(req.body , 'name' , 'email');
  console.log(updatedObject) ;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedObject, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data : {
      user : updatedUser
    }
  });
});
