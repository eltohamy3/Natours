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
  });
const port = process.env.PORT || 8000;
console.log(`the current port is ${process.env.PORT}`);
//console.log(app.get('env'));
//console.log(process.env);

// const testTour = new Tour({
//   name: "The Park Camper Eltoo My too",
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log("Newly created tour", doc);
//   })
//   .catch((err) => {
//     console.log("ERROR : ", err);
//   });
// const x = 3;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
