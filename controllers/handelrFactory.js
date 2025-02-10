const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/APIFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No tour found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: {
        data: null,
      },
    });
  });

exports.UpdateOne = (Mode) =>
  catchAsync(async (req, res, next) => {
    // /:id
    const updatedDoc = await Mode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return next(new AppError("No tour found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: updatedDoc,
      },
    });
  });

exports.CreatOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: "success  ",
      data: {
        data: newDoc,
      },
    });
  });

exports.getOne = (Model, populateOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOption) query = query.populate(populateOption);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No tour found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let query;
    if (req.myFiltetr) query = Model.find(req.myFiltetr);
    else query = Model.find();
    const features = new APIFeatures(query, req.query)
      .filter()
      .sorting()
      .limitingFields()
      .pagination();
    const AllData = await features.query;
    // send the response
    res.status(200).json({
      status: "success",
      result: AllData.length,
      data: {
        data: AllData,
      },
    });
  });
