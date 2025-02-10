/* eslint-disable prettier/prettier */
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const factory = require ('./handelrFactory') ;

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el) && obj[el]) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.addUserId = (req ,res , next)=>{
  req.params.id =   req.user.id; 
  next() ;
}
exports.getMe = factory.getOne(User) ;
exports.getAllUsers = factory.getAll(User) ;

exports.CreateUser = factory.CreatOne(User)

exports.getUser = factory.getOne(User) ;
// Update user by ID
// do not update the password with this 

exports.UpdateUser = factory.UpdateOne(User) ;
exports.DeleteUser =factory.deleteOne(User) ;

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
  console.log(req.body);
  const updatedObject = filterObj(req.body, "name", "email");
  console.log(updatedObject);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedObject, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

