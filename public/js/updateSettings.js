import axios from "axios";
import ApiLinks from "./../../constant/apiLink";
import AppError from "../../utils/appError";
import { showAlert } from "./alerts";

export const updateUserData = async (name, email) => {
  try {
    const res = await axios.patch(ApiLinks.updateUserData, {
      name,
      email,
    });
    console.log(res) ;
    if (res.data.status ==='success'){
      showAlert("success", "Data Updated Successfuly");
    }else{
      const errorMessage =
      res.message || "Update your data failed. Try again.";
      showAlert("error" , errorMessage);
    }
  } catch (err) {
    console.error(err); // Debugging: Print full error object

    // Ensure 'err.response' and 'err.response.data' exist before accessing properties
    const errorMessage =
      err.response?.data?.message || "Update your data failed. Try again.";
    showAlert("error", errorMessage);
  }
};
