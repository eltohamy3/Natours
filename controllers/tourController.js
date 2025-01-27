/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const Tour = require("./../models/tourModel");

const tours = [] ;

exports.getAllTours = async (req, res) => {


   try{
   const AllTour = await Tour.find() ;

   res.status(200).json({
    status: 'success',
    result: AllTour.length,
    data: {
      tours: AllTour,
    },
  });
   }catch(err){
    res.status(400).json({
      status: "failure",
      message: err,
    });
   }

};
exports.CreatTours = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success  ",
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "failure",
      message: e,
    });
  }
};

exports.getTour = async(req, res) => {
  
  try{
     const MyTour =   await Tour.findById(req.params.id) ;
     res.status(200).json({
      status: "success",
      data: {
        tour: MyTour,
      },
     });

  }catch(err){
  res.status(400).json({
    status: "failure",
    message: err,
  });
  }
};
exports.UpdateTour =async (req, res) => {

  // /:id
  try{
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  }catch(err){
    res.status(400).json({
      status: "failure",
      message: err,
    });
  }

};
exports.deleteTour =async (req, res) => {
  try{
    const DTour =   await Tour.findByIdAndDelete(req.params.id) ;
    res.status(200).json({
     status: "success",
     data: {
       tour: DTour,
     },
    });

 }catch(err){
 res.status(400).json({
   status: "failure",
   message: err,
 });
 }
};
