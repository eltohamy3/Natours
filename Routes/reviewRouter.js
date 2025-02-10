const express = require("express");

const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get( reviewController.addTourId,reviewController.getTourReview)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourAndUserId ,
    reviewController.creatReview,
  );
router
  .route("/:id")
  .delete(authController.protect, reviewController.deleteReview)
  .patch(authController.protect, reviewController.updateReview)
  .get(authController.protect, reviewController.getReview) ;
module.exports = router;
