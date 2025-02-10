const mongoose = require("mongoose");
// const slugify = require("slugify");
const Tour = require('./tourModel') ;
const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    review: {
      type: String,
      required: [true, "review can not be empty!."],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    rating: {
      type: Number,
      max: [5, "the max rating is 5"],
      min: [1, "the min rating is 1"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  // remove this for performance
//   .populate({
//     path: "tour",
//     select: "name", // "-id" here excludes the virtual "id", if it's defined as such.
// });
  next();
});

reviewSchema.statics.calcAverageRating = async function (tourId){
  // this refers to the current Model  
  const stats = await this.aggregate([ 
    {
      $match : {
        tour : tourId
      }
    } ,
    {
      $group : {
        _id: null,
        avgRating: { $avg: "$rating" },
        ratingsQuantity : { $sum : 1}
      }
    }
  ]) ;
  if (stats.length > 0){
    await Tour.findByIdAndUpdate(tourId , {
      ratingsAverage : stats[0].avgRating ,
      ratingsQuantity : stats[0].ratingsQuantity
     });
  }else{
    await Tour.findByIdAndUpdate(tourId , {
      ratingsAverage : 0 ,
      ratingsQuantity : 4.5
     });
  }


}
reviewSchema.post("save" , async function (doc , next){
  // this points to the current review
  // this.constructor => refers to the current 
    this.constructor.calcAverageRating(doc.tour) ;
    next(); 
})
/*
we pass the review form the pre to middleware to the post middelware
*/
reviewSchema.pre(/^findOneAnd/ , async function (next){
  // this points to the current query
  this.review = await this.findOne() ;
  console.log(this.review) ;
  next(); 
});
reviewSchema.post(/^findOneAnd/ , async function (docs ,next){
  // this points to the current query
  await this.model.calcAverageRating(this.review.tour); 
  next() ;
})
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
