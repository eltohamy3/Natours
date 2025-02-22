const express = require('express') ;
const viewController = require('./../controllers/viewController') ;
const router = express.Router() ;
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController'); 

router.use(authController.isLoggedIn);
router.get('/' ,bookingController.creatBookingCheckout , viewController.overview);
router.get('/tour/:tourSlug' ,viewController.tourDetail) ;
router.get('/login' ,viewController.getLoginForm) ;
router.get('/me' ,viewController.account) ;
router.get('/my-tours' ,authController.protect , viewController.getMyTours) ;


module.exports = router;