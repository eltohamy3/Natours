const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination :  (req , file , cb)=>{
    cb(null  , 'public/img/users') ;// select the path to upload the file in it
  } ,
  filename: (req, file ,cb)=>{
    // this is some way to store the name of the image
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) ;
    
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    // this is other user-userid-currentTimeStamb.extention
    // user-43r4nmmn554kfjdjf5-858573495748.jpeg
    const ext = file.mimetype.split('/')[1] ; // it like image/jpeg
    cb(null , `user-${req.user.id}-${Date.now()}.${ext}`) ;

  }
});

const multerFilter = (req,file , cb)=>{
  if (file.mimetype.startsWith('image')){
    cb(null, true) ;
  }else{
    cb(new AppError('Not an image! Please upload only images.' , 404) , false) ;
  }
}
const upload = multer({storage : multerStorage , fileFilter : multerFilter});

module.exports = upload ;