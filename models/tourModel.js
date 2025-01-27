

const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "A tour must have a unique name"],
    required: [true, "A tour must have a name"], // Ensure it's marked as required
  },
  rating: {
    type: Number,
    default: 3.2,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  difficulty: {
    type: String,
  },
});

  const Tour = mongoose.model("Tour", tourSchema);

  module.exports = Tour ;