const catchAsync = require("../utils/catchAsync");
const Tour  = require('./../models/tourModel');
const AppError = require('./../utils/appError'); 
const Booking = require("./../models/bookingModel");
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
     if (!tour){
      return next(new AppError('There is no tour with that name' , 404)) ;
     }
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
exports.getSignupForm = catchAsync(async (req, res , next) => {
  if (res.locals.user){
    res.redirect('/'); // Redirect to the home page
  }
  res.status(200).render("signup", {title: 'Create a new Account '});

});
exports.account =(req, res , next) => {
  if (res.locals.user){
    res.status(200).render("account", {
      title: 'Your account',
    });
  }else{
    res.redirect('/login');
  }
};

exports.getMyTours = catchAsync(async (req, res, next)=>{
  console.log("Heare in the get My TOurs"); 
  // 1 ) find all bookings 

  // 2 ) find tours with the returnd IDs

  const bookings = await Booking.find({
    user: req.user.id
  }) ;

  const tourIDs = bookings.map(el => el.tour) ;

  const tours = await Tour.find({_id:{ $in : tourIDs}});
  res.status(200).render('overview' , {
    title : "My Tours" ,
    tours
  });
// res.status(200).json({
//   status : 'success' ,
//   data : {
//     data : bookings
//   }
// });

});