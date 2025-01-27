/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable prettier/prettier */


 const myPromisses = new Promise((resolve , reject)=>{


    const x =1; 
    if (x==1){
        resolve("The x is one"); 
    }else{
        reject("The x is not one");
    }
 }).then(resolvevale=>console.log(resolvevale) ,
        rejectValue=>console.log(rejectValue)

).finally(()=>console.log("finish the program"));

