/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const AppError = require("../utils/appError");
const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handelrFactory");
const upload = require("./../utils/imageUpload");

const sharp = require("sharp");
// Get all tours

exports.getAllTours = factory.getAll(Tour);
exports.CreatTours = factory.CreatOne(Tour);

exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.UpdateTour = factory.UpdateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getDistances = catchAsync(async (req, res, next) => {
  // method to get all the distance form all the tours
  const { latlng, unit } = req.params; // all the values are string
  const [lat, lng] = latlng.split(",");
  if (!lat || !lng)
    return next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400,
      ),
    );
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    length: distances.length,
    data: {
      data: distances,
    },
  });
});
exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params; // all the values are string
  const [lat, lng] = latlng.split(",");
  if (!lat || !lng)
    return next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400,
      ),
    );
  // radius = distance / radius of the earth
  // r earth = 3963.2 in mi and 6378.1 in km
  // it now it is in radian
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });
  res.status(200).json({
    status: "success",
    length: tours.length,
    data: {
      data: tours,
    },
  });
});
exports.getTourStats = catchAsync(async (req, res, next) => {
  // stats about tours
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        numTours: { $sum: 1 },
        numOfRatings: { $sum: "$ratingsQuantity" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats: stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res) => {
  // get monthly plan for a year
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    lenght: plan.length,
    data: {
      plan: plan,
    },
  });
});

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) cover image
  req.files.imageCover[0].filename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333) // resize the image to square
    .toFormat("jpeg") // convert the image to jpeg format
    .jpeg({ quality: 90 }) // reduce the quality to 90%
    .toFile(`public/img/tours/${req.files.imageCover[0].filename}`); //store the image
  // store the name of the image to body to be updated in the database
  req.body.imageCover = req.files.imageCover[0].filename;
  //
  // 2 ) IMages
  req.body.images=[];
  await Promise.all(  req.files.images.map(async (file, index) => {
    const Filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
    await sharp(file.buffer)
      .resize(2000, 1333) // resize the image to square
      .toFormat("jpeg") // convert the image to jpeg format
      .jpeg({ quality: 90 }) // reduce the quality to 90%
      .toFile(`public/img/tours/${Filename}`); //store the image
    // store the name of the image to body to be updated in the database
    req.body.images.push(Filename) ;
  })
) ;
  next();
});
exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);
/* 
to upload single image use =>     upload.single('image')
to upload multiImage with the same field name image use =>     upload.array('images')
to upload multiImage with diffrent fields name image use =>     upload.fields({
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);
*/
