const mongoose = require ('mongoose'); 

const bookingSchema = mongoose.Schema({
  user : {
    type : mongoose.Schema.ObjectId ,
    ref : 'User' ,
    required :[true , 'Booking must belong to a Tour!.']
  }  , 
  tour:{
    type : mongoose.Schema.ObjectId ,
    ref : 'Tour' ,
    required :[true , 'Booking must belong to a user!.']
  } ,
  price : {
    type : Number ,
    require :[true , 'Bokking must have a price']
  },
  cretedAt :{
    type : Date , 
    default : Date.now()
  } ,
  paid :{ // if the admin make a booking outside a stripe 
    type: Boolean ,
    default : true
  }
  
});

bookingSchema.pre(/^find/ , function (next) {
  this.populate('user').populate('user').populate({
    path: 'tour' ,
    select: 'name'
  });
  next() ;

});
bookingSchema.index({tour  :1 ,  user : 1} , {
  unique : true
}) ;

const Booking = mongoose.model('Booking' , bookingSchema); 

module.exports = Booking;
