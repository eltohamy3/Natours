/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handelrFactory");
// Get all tours

exports.getAllTours = factory.getAll(Tour) ;
exports.CreatTours = factory.CreatOne(Tour);

exports.getTour = factory.getOne(Tour, { path: "reviews"});
exports.UpdateTour = factory.UpdateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};
exports.getTourStats = catchAsync(async (req, res) => {
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
