import axios from "axios";
import ApiLinks from "./../../constant/apiLink";
import { showAlert } from "./alerts";

export const updateSettings = async (data, type) => {
  try {
    type = type.toLowerCase() ;
    
    const res = await axios.patch( type ==='password'? ApiLinks.updateUserPassword : ApiLinks.updateUserData, data);

    console.log(res) ;
    if (res.data.status ==='success'){
      showAlert("success", `${type =='password' ?"Password" : "Data"} Updated Successfuly`);
      window.setTimeout( ()=>{
        window.location.reload(true);
      } , 3000) ;

    }else{
      const errorMessage =
      res.message || `Update your ${type =='password' ?"Password" : "Data"} failed. Try again.`;
      showAlert("error" , errorMessage);
    }
  } catch (err) {
    console.error(err); // Debugging: Print full error object

    // Ensure 'err.response' and 'err.response.data' exist before accessing properties
    const errorMessage =
    res.message || `Update your ${type=='password' ?"Password" : "Data"} failed. Try again.`;
    showAlert("error", errorMessage);
  }
};
