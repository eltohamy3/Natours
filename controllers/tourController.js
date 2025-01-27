/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const Tour = require("./../models/tourModel");

const tours = [] ;

/*
exports.checkId = (req, res, next, val) => {
  console.log(`The value is ${val}`);

  if (val * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
*/
exports.getAllTours = (req, res) => {
  console.log(req.requestTime1);
  console.log('Hear in getAll Tours');
  res.status(200).json({
    requesteAt: req.requestTime1,
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};
exports.CreatTours = (req, res) => {
  console.log(req.requestTime1);

  // console.log(req.body) ;
  
      res.status(201).json({
        requesteAt: req.requestTime1,
        status: 'success  ',
        data: {
        },
      });
    }
exports.UpdateTour_patch = (req, res) => {
  console.log('Heare in get update tours');

  console.log(req.requestTime1);
  res.status(200).json({
    requesteAt: req.requestTime1,
    status: 'success',
    data: {
      tour: '<Updated Tour Hear',
    },
  });
};
exports.deleteTour = (req, res) => {
  console.log(req.requestTime1);
  res.status(204).json({
    requesteAt: req.requestTime1,
    status: 'success',
    data: null,
  });
};
