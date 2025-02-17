import { showAlert } from "./alerts";
import axios from 'axios'
import ApiLinks from './../../constant/apiLink'; 
export const login = async (email, password) => {
  try {
    const res = await axios.post(ApiLinks.login, { email, password });

    console.log(res); // Debugging: Print the response

    if (res.data && res.data.status === "success") {
      showAlert("success", "Login Successfully!");
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
    const errorMessage = err.response?.data?.message || "Login failed. Try again.";
    showAlert("error", errorMessage);
  }
};


