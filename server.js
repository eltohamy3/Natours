/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

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
  }).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  }) ;
const port = process.env.PORT || 8000;
console.log(`the current port is ${process.env.PORT}`);
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection' , err =>{
  console.error('UNHANDLED REJECTION! :', err);
  server.close(()=>{
    console.error('Server is closing down...');
    process.exit(1);
  })
  
});

process.on ('uncaughtException' , err=>{
  console.error('UNCAUGHT EXCEPTION! :', err);
  server.close(()=>{
    console.error('Server is closing down...');
    process.exit(1);
  });

}) ;
