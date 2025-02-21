
const stripe = Stripe("pk_test_51QuvXeLRU3knGUpu6yQV8h3nrNmm2mX35OgIWMbnR6LxySYCYKM9RggZoAdKVvtFnIZODORWHgqSeh2aequHNm3J00yLhT6Vrg");
import axios from "axios";
import ApiLinks from './../../constant/apiLink'; 
import {showAlert} from './alerts'
export const bookTour = async (tourId) =>{
  try{
  // 1) get the session from the api
  
    const url = `${ApiLinks.CheckOutSession}/${tourId}`
    console.log(url); 
    const session = await axios.get(url); 
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId : session.data.session.id
    });
  }catch (err){
    console.error(err); // Debugging: Print full error object

    // Ensure 'err.response' and 'err.response.data' exist before accessing properties
    const errorMessage = err.response?.data?.message || "Booking failed. Try again.";
    showAlert("error", errorMessage);
  }
  
  //2)Create checkout form + Charge teh credit card 
}