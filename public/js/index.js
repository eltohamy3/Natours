import { login ,logout } from "./login";
import axios from "axios";
import { initMap } from "./googleMap";

import { updateUserData } from "./updateSettings";
import "@babel/polyfill";
//Dom element
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUserDataForm = document.querySelector(".form-user-data");


// values
// Function to load Google Maps API dynamically
const loadGoogleMaps = (callback) => {
  if (document.getElementById("google-maps-script")) return; // Prevent duplicate loading

  const script = document.createElement("script");
  script.id = "google-maps-script";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCP5dKuUn6JY65QB2pVF_oqDm2uqQGL_T0&callback=" + callback;
  script.async = true;
  script.defer = true;

  document.body.appendChild(script);
};
// Load Google Maps only if #map exists
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("map")) {
    window.initMap = initMap; // Make sure Google Maps API can call this function
    loadGoogleMaps("initMap");
  }
});

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if (updateUserDataForm){
  updateUserDataForm.addEventListener('submit' , (event) =>{
    event.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    updateUserData(name , email) ;
  })
}
if (logOutBtn){
  logOutBtn.addEventListener('click' , logout);
}