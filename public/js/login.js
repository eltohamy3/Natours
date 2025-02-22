import { showAlert } from "./alerts";
import axios from 'axios'
import ApiLinks from './../../constant/apiLink'; 
export const loginOrSingup = async (data , type) => {
  try {
    const res = await axios.post(type==='login'? ApiLinks.login :ApiLinks.signup,data);

    console.log(res); // Debugging: Print the response

    if (res.data && res.data.status === "success") {
      showAlert("success", `${type ==='login' ?"Login": "Signup"} Successfully!`);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      // Fallback message if 'res.data.message' is missing
      const errorMsg = res.data?.message || "An unexpected error occurred.";
      showAlert("error", errorMsg);
    }
  } catch (err) {
    console.error(err); // Debugging: Print full error object

    // Ensure 'err.response' and 'err.response.data' exist before accessing properties
    const errorMessage = err.response?.data?.message || `${type ==='login' ?"Login": "Signup"} failed. Try again.`;
    showAlert("error", errorMessage);
  }
};

export const logout = async ()=>{
  try{
    const res = await axios.get(ApiLinks.logout);
    if (res.data.status ==='success'){
      window.location.reload(true)
      window.location.assign("/");
    }
  }catch(err){
    showAlert("error", 'Error logging out! Try again.');

  }

}
