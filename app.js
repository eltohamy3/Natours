/* eslint-disable prettier/prettier */
// core modules


const express = require('express');
const AppError = require('./utils/appError') ;
const app = express();
const globalErrorHandler = require('./controllers/errorController') ;
const rateLimit = require('express-rate-limit');
app.use(express.json()); // to get the data of the body

const morgan = require('morgan');

const userRouter = require('./Routes/userRouters');
const tourRouter = require('./Routes/tourRouters');

// 1) GLOBAL Middleware
if (process.env.NODE_ENV==='development'){
  app.use(morgan('dev')); // to know some information about the router
}

const limiter = rateLimit({
  max : 100 ,  // for 100 request per hour
  windoMs : 60 *60 * 1000 ,  // for one hour
  message:  "Too many requests from this IP , please try again in an hour"
});
app.use('/api' , limiter) ;

// to allow the static pages to be run on the serve
app.use(express.static(`${__dirname}/public`));


// 1) tourRouter

app.use('/api/v1/tours', tourRouter);
// 2) User Routes
app.use('/api/v1/users', userRouter);

// 4) Error handling middleware

app.all('*' , (req , res , next) =>{

  next(new AppError(`Can't find ${req.originalUrl} on this server` , 404));// in this express know that it is an error and then skip all the other middleware and 
  // go the the global middleware handler only by pass the error  to the next function
})  
// error Handling middleware
app.use(globalErrorHandler)
module.exports = app;
