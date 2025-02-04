/* eslint-disable prettier/prettier */
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel") ;
const APIFeatures = require("./../utils/APIFeatures");
const AppError = require('./../utils/appError') ;

exports.getAllUsers = catchAsync (async (req, res , next) => {
  let userFeatures = new APIFeatures(User.find() , req.query)
  .filter() 
  .sorting()
  .limitingFields()
  let  users = await userFeatures.query;

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users: users,
    },
  });
});

exports.CreateUser = catchAsync( async (req, res , next) => {

  const newUser = await User.create(req.body ) ;
  res.status(201).json({
    status: 'success',
    data: {
      users: newUser,
    },
  });
});

exports.getUser =catchAsync( async (req, res) => {
  let userFeatures = new APIFeatures(User.findById(req.params.id ) , req.query)
  .limitingFields() ;

  const user = await userFeatures.query;
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});


 // Update user by ID
exports.UpdateUser = catchAsync(async(req, res , next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) ;
  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.DeleteUser = catchAsync(async(req, res , next) => {
  const deltedUser = await User.findByIdAndDelete(req.params.id ); 
  if (!deltedUser) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(500).json({
    status: 'fail',
    message: 'user not found',
  });
});
