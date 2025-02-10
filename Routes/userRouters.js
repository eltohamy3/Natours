const express = require("express");

const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// -------------forgot password --------------------------------------------
router.post("/forgotPassword", authController.forgotPassword); //
router.patch("/resetPassword/:token", authController.resetPassword);

//----------------update Password-------------------------------

// use authController
router.use(authController.protect);
router.route("/updateMyPassword").patch(authController.updatePassword); //

// router.patch('/resetPassword/:token' , authController.resetPassword) ;

//----------------update Data-------------------------------

router.route("/updateMe").patch(userController.updateMe); //
// router.patch('/resetPassword/:token' , authController.resetPassword) ;
router.get("/me", userController.addUserId, userController.getMe);

// delete user
router.route("/deleteMe").delete(userController.deleteMe);

/// this routers for system administration to change it
router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.CreateUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.UpdateUser)
  .delete(userController.DeleteUser);
module.exports = router;
