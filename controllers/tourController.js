/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/APIFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require('./../utils/appError') ;

// Get all tours

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sorting()
    .limitingFields()
    .pagination();

  const AllTour = await features.query;
  // send the response
  res.status(200).json({
    status: "success",
    result: AllTour.length,
    data: {
      tours: AllTour,
    },
  });
});
exports.CreatTours = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success  ",
    data: {
      tour: newTour,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const MyTour = await Tour.findById(req.params.id)

  if (!MyTour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: MyTour,
    },
  });
});
exports.UpdateTour = catchAsync(async (req, res, next) => {
  // /:id
  
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      tour: updatedTour,
    },
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const DTour = await Tour.findByIdAndDelete(req.params.id);
  if (!DTour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: {
      tour: null,
    },
  });
});
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
exports.getMonthlyPlan =catchAsync( async (req, res) => {
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
