const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // console.log(file,"file");
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

var upload = multer({
  storage: storage,
  // fileFilter:(req,file,cb)=>{
  //     if(file.mimetyoe=="image/png" || file.mimetype=="image/jpg"){
  //         cb(null,true)
  //     }else{
  //         console.log('only jpg & png file supported');
  //         cb(null,false)
  //     }
  // },
  // limits:{
  //     fileSize:1024*1024*2
  // }
});

module.exports = upload;
