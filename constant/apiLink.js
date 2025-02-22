const serverLink = ''
const apiLink =   `${serverLink}/api/v1`; 
exports.getAllTour = `${apiLink}/tours`; 
exports.login = `${apiLink}/users/login`; 
exports.signup = `${apiLink}/users/signup`; 

exports.logout = `${apiLink}/users/logout`; 

exports.CheckOutSession = `${apiLink}/bookings/checkout-session`; // then we will specify the tour id 

exports.updateUserData = `${apiLink}/users/updateMe`; // patch for update name and email only 
exports.updateUserPassword= `${apiLink}/users/updateMyPassword`; // patch for update name and email only 