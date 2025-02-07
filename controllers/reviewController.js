
const Review  = require('./../models/reviewModel') ;
const APIFeatures = require('./../utils/APIFeatures') ;
const catchAsync = require('./../utils/catchAsync') ;
exports.getALlReviews =catchAsync(async (req, res , next)=>{
    let feature = new APIFeatures(Review.find() , req.query)    .filter()
    .sorting()
    .limitingFields()    
    const reviews = await feature.query; 
    res.status(200).json({
        status : 'success' ,
        length: reviews.length , 
        data:{
            reviews: reviews
        }
    })
}
);
exports.creatReview = catchAsync(async (req, res ,next)=>{
    req.body.user = req.user.id ;
    const review = await Review.create(req.body) ;
    res.status(201).json({
        status : 'success' ,
        data:{
            review: review
        }
    })

}) ;