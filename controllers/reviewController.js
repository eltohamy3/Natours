const Review = require("./../models/reviewModel");
// const APIFeatures = require("./../utils/APIFeatures");
// const catchAsync = require("./../utils/catchAsync");
const factory = require("./handelrFactory");



exports.setTourAndUserId = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    if (!req.body.tour) req.body.tour = req.params.tourId;
    next();
};
exports.addTourId = (req, res , next) =>{
    if (req.params.tourId) req.myFiltetr = {tour :req.params.tourId };
    next() ;
}



// tour reviews
exports.getTourReview = factory.getAll(Review ); 

// get single review
exports.getReview = factory.getOne(Review);
// create a review
exports.creatReview = factory.CreatOne(Review);

// delte reivew
exports.deleteReview = factory.deleteOne(Review);

// update reivew
exports.updateReview = factory.UpdateOne(Review);

