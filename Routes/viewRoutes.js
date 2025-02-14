const express = require('express') ;
const viewController = require('./../controllers/viewController') ;
const router = express.Router() ;

router.get('/' , viewController.overview);
router.get('/tour' ,viewController.tourDetail) ;

module.exports = router;