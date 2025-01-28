const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "A tour must have a unique name"],
    required: [true, "A tour must have a name"], // Ensure it's marked as required
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    //  how many people can be tackpart to this tour group
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
  },
  ratingsAverage: {
    type: Number,
    default: 3.2,
  },
  ratingsQuantity: {
    // how many people rate this tour
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: {
    type: Number , 
  } , 
  summary: {
    type: String, 
    trim: true,
    required: [true, "A tour must have a summary"],
  } , 
  description: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description"],
  },
  imageCover:{
    type: String,
    required: [true, "A tour must have a cover image"],
  } , 
  images:[String] , 
  createdAt: {
    type: Date,
    default: Date.now(),
  }, 
  startDates: [Date]
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
