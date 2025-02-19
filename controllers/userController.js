/* eslint-disable prettier/prettier */
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const factory = require("./handelrFactory");
const upload = require("../utils/imageUpload");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el) && obj[el]) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.addUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getMe = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

exports.CreateUser = factory.CreatOne(User);

exports.getUser = factory.getOne(User);
// Update user by ID
// do not update the password with this

exports.UpdateUser = factory.UpdateOne(User);
exports.DeleteUser = factory.deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) throw error if tuser posts password data
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        "This route is not for Password Updates . Please use /updateMyPassword.",
        400,
      ),
    );
  console.log(req.file);

  /// 2 UPDATE THE  user document

  console.log(req.body);
  const updatedObject = filterObj(req.body, "name", "email");
  console.log(updatedObject);
  if (req.file) {
    updatedObject.photo = req.file.filename;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedObject, {
    new: true,
    runValidators: true,
  });
  // if it saved successfuly then we will remove the old user the old user phot from the database
  if (req.file) {
    // remove the update photo from the database
    if (req.user.photo !== "default") {
      // if not the first time
      const oldPhotoPath = path.normalize(
        path.join(__dirname, "../", "public", "img", "users", req.user.photo),
      );
      console.log(`oldphotoPath : ${oldPhotoPath}`);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath); // Delete old photo
      }
    }
  }
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

exports.uploadUserPhoto = upload.single("photo"); // only single image for the user photo

exports.resizeImage = catchAsync( async (req, res, next) => {
  console.log(req.file) ;
  if (!req.file) return next();
  console.log('hear') ;
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // since the file is stored on the memory it call by req.file.buffer
  await sharp(req.file.buffer)
    .resize(500, 500) // resize the image to square
    .toFormat("jpeg") // convert the image to jpeg format 
    .jpeg({ quality: 90 }) // reduce the quality to 90%
    .toFile(`public/img/users/${req.file.filename}`);  //store the image  

    next() ;
});
