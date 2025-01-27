/* eslint-disable prettier/prettier */
// core modules

const express = require('express');

const app = express();

const morgan = require('morgan');

const userRouter = require('./Routes/userRouters');
const tourRouter = require('./Routes/tourRouters');

// 1) Middleware

app.use(morgan('dev')); // to know some information about the router
app.use(express.json()); // to get the data of the body

app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log(`request made : ${req.method} ${req.url}`);
  next();
});
app.use((req, res, next) => {
  req.requestTime1 = new Date().toISOString();
  next();
});

// 1) tourRouter
app.use('/api/v1/tours', tourRouter);
// 2) User Routes
app.use('/api/v1/users', userRouter);
// 4 ) Start the server

module.exports = app;
