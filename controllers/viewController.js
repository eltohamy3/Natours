const catchAsync = require("../utils/catchAsync");
const axios = require('axios');
const Tour  = require('./../models/tourModel');
const ApiLinks = require('./../constant/apiLink'); 

exports.overview = catchAsync(async (req, res , next) => {
  // const responce = await axios.get(ApiLinks.getAllTour) ;
  // const Tours = responce.data.data.data; 
  const Tours = await Tour.find(); 
  // console.log(Tours) ;

  res.status(200).render("overview", {
    title: "All Tours",
    tours: Tours
  });
});

exports.tourDetail = catchAsync(async (req, res , next) => {
  // 1 ) get the tourData from the requrest including reviews and gides
     const tour = await Tour.findOne({slug : req.params.tourSlug}).populate({
      path : 'reviews' , 
      select :'rating review user'
     }); 
     console.log(tour) ;
  // 2 )
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
     tour
  });
});

exports.getLoginForm = catchAsync(async (req, res , next) => {
  if (res.locals.user){
    res.redirect('/'); // Redirect to the home page
  }
  res.status(200).render("login", {
    title: 'Login into your account',
  });
});