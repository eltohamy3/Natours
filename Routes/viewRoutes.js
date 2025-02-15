const express = require('express') ;
const viewController = require('./../controllers/viewController') ;
const router = express.Router() ;

router.get('/' , viewController.overview);
router.get('/tour/:tourSlug' ,viewController.tourDetail) ;

module.exports = router;