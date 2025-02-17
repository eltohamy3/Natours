const serverLink = 'http://127.0.0.1:8000'
const apiLink =   `${serverLink}/api/v1`; 
exports.getAllTour = `${apiLink}/tours`; 
exports.login = `${apiLink}/users/login`; 
exports.logout = `${apiLink}/users/logout`; 
exports.updateUserData = `${apiLink}/users/updateMe`; // patch