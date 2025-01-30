const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "A tour must have a unique name"],
      required: [true, "A tour must have a name"], // Ensure it's marked as required
      maxLength:[50, "A tour must have at most 50 characters"] , 
      minLength:[10, "A tour must have at least 10 characters"] , 
      
    },
    slug: String,
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
      type: Number,
      validate: {
        validator: function(val){
          // this only work for create and donot work on update 
          return this.price >= val; 
        } ,
        message: "Price must be equal to or greater than the discount price",
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // exclude this field from the output
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
      //  select: false, // exclude this field from the output
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});


// this work only when create or save and not in the update process 

tourSchema.pre("save", function (next) {
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.post("save", function (doc, next) {
  console.log("New tour has been saved:", doc);
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// aggregation middleware

tourSchema.pre("aggregate", function (next) {
 // this.pipeline().match({ secretTour: { $ne: true } });
  this.pipeline().unshift({$match: { secretTour: { $ne: true }}}); 
  console.log(this.pipeline()) ;
  next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
