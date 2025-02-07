const express = require("express");

const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");
const { model } = require("mongoose");

const router = express.Router();

router
  .route("/")
  .get(reviewController.getALlReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.creatReview,
  );
module.exports = router;
