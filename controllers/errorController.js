const AppError = require("./../utils/appError");
const sendErrorDev = (err, req, res) => {
  // aPI
  if (req.originalUrl.startsWith("/api")) {
    res.json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // Renderd Website
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // 1) for the API
  if (req.originalUrl.startsWith("/api")) {
    // operational , trusted error : send message to client
    if (err.isOperational === true) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // programming or other unkonwn error : don't leak error details
    } else {
      // 1) log the error
      console.error("ERRor : " + err);
      // 2) send generic message
      res.status(500).json({
        status: "error",
        message: "Something went wrong , please try again later",
      }); // in production , we want to keep server logs for debugging purposes. 500 status code indicates something went wrong.
    }
  } else {
    
    // 2) Renderd Website
    // operational , trusted error : send message to client
    if (err.isOperational === true) {
      // Renderd Website
      res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: err.message,
      });
      // programming or other unkonwn error : don't leak error details

    } else {
      // 1) log the error
      console.error("ERRor : " + err);
      // 2) send generic message
      // Renderd Website
      res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Something went wrong , please try again later",
      });
    }

  }
};
const handelCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
const handelDublicateFieldDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use unique value.`;
  return new AppError(message, 400);
};
const handelvalidationErrorDB = (err) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handelJWTError = () =>
  new AppError("Invalid token , Please log in again!", 401);
const handTokenExpiredError = () =>
  new AppError("The token expired Date is ended please log in again", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    // let error = { ...err };
    let error = Object.assign({}, err); // Fix here
    // console.log("Error Object:", error);
    // console.log("Error Name:", error.name);

    if (err.name === "CastError") {
      error = handelCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handelDublicateFieldDB(err);
    }
    if (err.name === "ValidationError") {
      error = handelvalidationErrorDB(err);
    }
    if (err.name === "JsonWebTokenError") {
      error = handelJWTError(err);
    }
    if (err.name === "TokenExpiredError") {
      error = handTokenExpiredError(err);
    }

    sendErrorProd(err, req, res);
  }
};
