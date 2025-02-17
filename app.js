/* eslint-disable prettier/prettier */
// core modules

const express = require("express");
const path = require("path");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xxs = require("xss-clean");
const hpp = require("hpp");

const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const userRouter = require("./Routes/userRouters");
const tourRouter = require("./Routes/tourRouters");
const reviewRouter = require("./Routes/reviewRouter");
const viewRouter = require('./Routes/viewRoutes') ;
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


// 1) GLOBAL Middleware
// to allow the static pages to be run on the server
app.use(express.static(path.join(__dirname ,"public" ) ));

// Set Security HTTP header
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests form same API
const limiter = rateLimit({
  max: 100, // for 100 request per hour
  windoMs: 60 * 60 * 1000, // for one hour
  message: "Too many requests from this IP , please try again in an hour",
});
app.use("/api", limiter);

// body parser , reading data from body int req.body and limit the size of the body to 10kb
app.use(express.json({ limit: "10kb" })); // to get the data of the body
// to access the  cookie body
app.use(cookieParser());
// Data sanitzation against NoSQL query injection
app.use(mongoSanitize());

// Data sanitzation against cross site scripting attaces
// clean the body from melicious scrits like html code
app.use(xxs());

// to prevent the http parameter pollution
app.use(
  hpp({
    whitelist: [
      "name",
      "slug",
      "maxGroupSize",
      "difficulty",
      "ratingsAverage",
      "price",
      "priceDiscount",
    ],
  }),
  
);

// Adjust Content Security Policy (CSP) to allow Google Maps
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Allow resources from the same origin
      scriptSrc: [
        "'self'",
        "https://maps.googleapis.com",  // Allow Google Maps scripts
        "https://fonts.googleapis.com", // Allow Google Fonts
        "https://cdnjs.cloudflare.com"
      ], 
      connectSrc: [
        "'self'", 
        "https://maps.googleapis.com", // Allow Google Maps API calls
        "ws://127.0.0.1:*" // ✅ Allow WebSocket connections (Parcel HMR)
      ],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'",  // Allow inline styles
        "https://fonts.googleapis.com"  // Allow Google Fonts
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https://maps.googleapis.com",  // Allow images from Google Maps
        "https://maps.gstatic.com"  // Allow images from Google Maps
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow fonts from Google Fonts
    },
  })
);


// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies) ;
  next();
});
// 1) tourRouter
app.use('/', viewRouter);
app.use("/api/v1/tours", tourRouter);
// 2) User Routes
app.use("/api/v1/users", userRouter);

// 3) Review Router
app.use("/api/v1/reviews", reviewRouter);
// 4) Error handling middleware

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // in this express know that it is an error and then skip all the other middleware and
  // go the the global middleware handler only by pass the error  to the next function
});
// error Handling middleware
app.use(globalErrorHandler);
module.exports = app;
