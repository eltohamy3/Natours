const express = require('express');

const userController = require('./../controllers/userController'); 
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login' , authController.login) ;


// -------------forgot password --------------------------------------------
router.post('/forgotPassword', authController.forgotPassword); // 
router.patch('/resetPassword/:token' , authController.resetPassword) ;

//----------------update Password-------------------------------
router.route('/updateMyPassword').patch(authController.protect ,authController.updatePassword) // 
// router.patch('/resetPassword/:token' , authController.resetPassword) ;

/// this routers for system administration to change it 
router.route('/').get(userController.getAllUsers).post(userController.CreateUser);
router.route('/:id').get(userController.getUser).patch(userController.UpdateUser).delete(userController.DeleteUser);

module.exports = router;