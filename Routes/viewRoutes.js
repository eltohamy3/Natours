const express = require('express') ;
const viewController = require('./../controllers/viewController') ;
const router = express.Router() ;
const authController = require('./../controllers/authController');


router.use(authController.isLoggedIn);
router.get('/' , viewController.overview);
router.get('/tour/:tourSlug' ,viewController.tourDetail) ;
router.get('/login' ,viewController.getLoginForm) ;

module.exports = router;