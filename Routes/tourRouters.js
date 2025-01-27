/* eslint-disable import/newline-after-import */

const express = require('express');
const tourController = require('./../controllers/tourController') ;
const router =express.Router();


// router.param('id' ,tourController.checkId); 
router.route('/').get(tourController.getAllTours).post( tourController.checkBody, tourController.CreatTours);

router.route('/:id').patch(tourController.UpdateTour_patch).delete(tourController.deleteTour);


module.exports = router ; 