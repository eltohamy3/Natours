/* eslint-disable prettier/prettier */
// core modules

const express = require('express');

const app = express();
app.use(express.json()); // to get the data of the body

const morgan = require('morgan');

const userRouter = require('./Routes/userRouters');
const tourRouter = require('./Routes/tourRouters');

// 1) Middleware

app.use(morgan('dev')); // to know some information about the router

app.use(express.static(`${__dirname}/public`));


// 1) tourRouter
app.use('/api/v1/tours', tourRouter);
// 2) User Routes
app.use('/api/v1/users', userRouter);

// 4) Error handling middleware

app.all('*' , (req , res , next) =>{
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`
  // });
  const err = new Error(`Can't find ${req.originalUrl} on this server`) ; 
  err.statusCode = 404;
  err.status = "fail"; 
  next(err);// in this express know that it is an error and then skip all the other middleware and 
  // go the the global middleware handler only by pass the error  to the next function
})  

// error Handling middleware
app.use((err , req , res , next)=>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
})
module.exports = app;
