const multer = require("multer");
const uuid = require("uuid/v1");

const MIME_TYPE_MAP ={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
};

//Wehre to store and ehich files to accept 
const fileUpload = multer({
    limits:500000,
    storage: multer.diskStorage({
        destination:(req,file,cb)=>{
       cb(null,'uploads/images')
        },
        filename:(req,file,cb)=>{
         const ex = MIME_TYPE_MAP[file.mimetype];
         cb(null,uuid() + '.'+ ex)
        }
    }),
    fileFilter:(req,file,cb) =>{
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error("Invaild mime type")
        cb(error,isValid);
    }
});

module.exports = fileUpload;