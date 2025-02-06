/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require('./../../models/tourModel')
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

  const tours = fs.readFileSync('./tours.json' , 'utf-8');
  const tourData = JSON.parse(tours);

  const importData= async ()=>{
    try{
     await Tour.create(tourData) ;
      console.log("Data imported successfully");
       process.exit();

    }catch(err){
      console.error("Error importing data", err);
    }
  }

  const DeleteData = async ()=>{
    try{
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

