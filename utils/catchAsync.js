module.exports = fun => {
    return (req , res , next) => {
      fun(req, res, next).catch(next); // it send the error automatically to the next function
    } 
  
  };