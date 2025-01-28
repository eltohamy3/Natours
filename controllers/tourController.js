/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const Tour = require("./../models/tourModel");

const tours = [] ;

exports.getAllTours = async (req, res) => {


   try{

    // BUILD QUERY
    //1) filtering 
    const queryObj = {...req.query} ;
    const excludedFiled = ['page' , 'sort' , 'limit' , 'fields'] ;
    excludedFiled.forEach(field => delete queryObj[field]);

   console.log(queryObj) ;


   // 2 advanced filtering
   let QueryString = JSON.stringify(queryObj) ;
   QueryString =  QueryString.replace(/\b(gte|gt|lt|lte)\b/g ,matchedWOrd => `$${matchedWOrd}` ) ;
   console.log(QueryString) ;
   console.log(JSON.parse(QueryString)) ;
    

   let query = Tour.find(JSON.parse(QueryString)) ;
   // 3) sorting
   if (req.query.sort){
    console.log(req.query.sort) ;
    let sortByString = req.query.sort.split(',').join(' ') ;
    console.log(sortByString) ; 
      query = query.sort(sortByString) ;
   }else{
    query = query.sort('-createdAt') ;
   }
   // 4) limiting fields
     if (req.query.fields){
      const fields = req.query.fields.split(',').join(' ') ;
      query = query.select(fields);
     }else{
      query = query.select('-__v') ;
     }

     // 5) pagination
     let defaultPage = (req.query.page*1) ||1 ; 
     let defaultLimit = (req.query.limit*1) || 100;
     const NoOfskipedDucomment = (defaultPage-1) * defaultLimit  ;
     query = query.skip(NoOfskipedDucomment).limit(defaultLimit) ;

     if (req.query.page ){
      const CountAllTours = await Tour.countDocuments() ;
      if (NoOfskipedDucomment >= CountAllTours){
        throw new Error('This page is not exist'); 
      }
     }

       // EXEXUTE QUERY

   const AllTour = await query; 
   
   // send the response 
   res.status(200).json({
    status: 'success',
    result: AllTour.length,
    data: {
      tours: AllTour,
    },
  });
   }catch(err){
    res.status(404).json({
      status: "failure",
      message:`${err}`,
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
    res.status(204).json({
     status: "success",
     data: {
       tour: null,
     },
    });

 }catch(err){
 res.status(400).json({
   status: "failure",
   message: err,
 });
 }
};
exports.aliasTopTours = (req, res , next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
 req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};