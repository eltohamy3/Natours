const mongoose = require("mongoose");
const slugify = require("slugify");

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
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
