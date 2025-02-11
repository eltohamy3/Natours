

/* eslint-disable import/newline-after-import */

const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");
const reviewRouter = require("./reviewRouter");
const router = express.Router();

router.route("/tour-stats").get(tourController.getTourStats);


router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide" , "guide"),
    tourController.getMonthlyPlan,
  );
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);
// router.param('id' ,tourController.checkId);
router.route('/tours-withn/:distance/center/:latlng/unit/:unit').get(tourController.getTourWithin) ;
router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.CreatTours,
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.UpdateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.deleteTour,
  );

router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
