/* eslint-disable import/newline-after-import */

const express = require('express');
const tourController = require('./../controllers/tourController') ;
const authController = require ('./../controllers/authController') ;
const router =express.Router();

router.route('/tour-stats').get(tourController.getTourStats) ;
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)
router.route('/top-5-cheap').get( tourController.aliasTopTours,tourController.getAllTours)
// router.param('id' ,tourController.checkId); 
router.route('/').get(authController.protect ,tourController.getAllTours).post(tourController.CreatTours);

router.route('/:id').get(tourController.getTour).patch(tourController.UpdateTour)
.delete(authController.protect , authController.restrictTo('admin') , tourController.deleteTour);



module.exports = router ; 