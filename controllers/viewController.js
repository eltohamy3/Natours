const catchAsync = require("../utils/catchAsync");
const axios = require('axios');
const ApiLinks = require('./../constant/apiLink'); 

exports.overview = catchAsync(async (req, res) => {
  const responce = await axios.get(ApiLinks.getAllTour) ;
  const Tours = responce.data.data.data; 
  console.log(Tours) ;

  res.status(200).render("overview", {
    title: "All Tours",
    tours: Tours
  });
});

exports.tourDetail = catchAsync(async (req, res) => {
  res.status(200).render("tour", {
    title: "The Forst Hiker Tour",
  });
});

