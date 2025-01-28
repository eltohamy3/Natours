/* eslint-disable import/newline-after-import */

const express = require('express');
const tourController = require('./../controllers/tourController') ;
const router =express.Router();


router.route('/top-5-cheap').get( tourController.aliasTopTours,tourController.getAllTours)
// router.param('id' ,tourController.checkId); 
router.route('/').get(tourController.getAllTours).post(tourController.CreatTours);

router.route('/:id').get(tourController.getTour).patch(tourController.UpdateTour).delete(tourController.deleteTour);


module.exports = router ; 