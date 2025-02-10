const express = require("express");

const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect); 
router
  .route("/")
  .get( reviewController.addTourId,reviewController.getTourReview)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourAndUserId ,
    reviewController.creatReview,
  );
router
  .route("/:id")
  .get( reviewController.getReview)
  .delete(authController.restrictTo('user' , 'admin'), reviewController.deleteReview)
  .patch(authController.restrictTo('user' , 'admin') , reviewController.updateReview)
module.exports = router;
