/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require('./../../models/tourModel') ;
const Review = require('./../../models/reviewModel') ;
const User = require('./../../models/userModel'); 

dotenv.config({ path: "./../../config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, // Added for compatibility
  })
  .then((con) => {
 //   console.log(con.connection);
    console.log("Connected to MongoDB successful"); //this will be printed when the connection is successful.
  });


  const tourData = JSON.parse(fs.readFileSync('./tours.json' , 'utf-8')) ;
  const users = JSON.parse(fs.readFileSync('./users.json' , 'utf-8')) ;
  const reviews = JSON.parse(fs.readFileSync('./reviews.json' , 'utf-8')) ;


  const importData= async ()=>{
    try{
     await Tour.create(tourData , {
     }) ;
     await User.create(users ,{
      validateBeforSave: false
     }

     ); 
     await Review.create(reviews);
      console.log("Data imported successfully");
       process.exit();

    }catch(err){
      console.error("Error importing data", err);
    }
  }

  const DeleteData = async ()=>{
    try{
      await Review.deleteMany() ;
      await User.deleteMany() ;
     await Tour.deleteMany();
      console.log("Data deleted successfully");
      process.exit();

    }catch(err){
      console.error("Error deleting data", err);
    }
  };

  if(process.argv[2] == '--import'){
    importData();
  }else if(process.argv[2] == '--delete'){
      DeleteData();
  }
console.log(  process.argv);

