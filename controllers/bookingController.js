const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Tour = require("./../models/tourModel");
const factory = require("./handelrFactory");
const Booking = require('./../models/bookingModel');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // ✅ Load .env before anything else
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: tour.id,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100, // amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment", // this is the mode options
  });
  // 3) Send the session response
  res.status(200).json({
    status: "success",
    session,
  });
});
exports.creatBookingCheckout = catchAsync (async (req, res, next)=>{

  // not secure 
  const {tour , user ,price} = req.query ;

  if (!tour || !user || !price) return next() ;

  // all is true 
  await Booking.create({tour , price , user}) ;

  res.redirect(req.originalUrl.split('?')[0]); // redirect the application to the rout without the query string 

}) ;




exports.createBooking = factory.CreatOne(Booking);


exports.deleteBooking = factory.deleteOne(Booking);

exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);

exports.updateBooking = factory.UpdateOne(Booking);



// // console.log('Stripe API Key:', process.env.STRIPE_SECRET_KEY);

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// exports.getCheckoutSession = catchAsync(async (req, res, next) => {
//   // 1)  get the currently booken tour
//   const tour = await Tour.findById(req.params.tourID);

//   // 2) create checkout session
//   /*
//       The stripe.checkout.sessions.create function in Node.js creates a Stripe Checkout session, allowing users to make secure payments.

//       Key Components:

//       payment_method_types → Specifies allowed payment methods (e.g., 'card').
//       success_url & cancel_url → Redirects users after payment success or failure.
//       customer_email → Automatically fills the user's email.
//       client_reference_id → Links the session to a specific order or product.
//       line_items → Contains details about the purchased item, including name, description, image, amount (in cents), and currency.
//       This session is then sent to the frontend, which redirects users to Stripe's hosted checkout page. 🚀
//   */
//   /// this session call the stripe api and so it return a promiss
//   // const stripeObject = stripe(process.env.STRIPE_SECRET_KEY);

//   const session = await stripe.checkout.session.create({
//     payment_method_types: ["card"],
//     success_url: `${req.protocol}://${req.get("host")}/`,
//     cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
//     customer_email: req.user.email,
//     client_reference_id: tour.id,
//     line_items: [
//       {
//         name: `${tour.name} Tour`,
//         description: tour.summary,
//         images: [`https://natours.dev/img/tours/${tour.imageCover}`],
//         amount: tour.price * 100, // in 1 dolar = 100 cense
//         currency: "usd", // for Cent (100 cent = 1$)
//         quantity: 1,
//       },
//     ],
//   });

//   // 3)create session as responce
//   res.status(200).json({
//     status: "success",
//     session,
//   });
// });
