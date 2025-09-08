import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter =(req:Express.Request, file:Express.Multer.File, cb:multer.FileFilterCallback)=>{
    const allowedTypes = ["image/jpeg","image/jpg","image/png"];
    if(allowedTypes.includes(file.mimetype )){
        cb(null,true);
    }else{
        cb(new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed."));
    }
}

export const uploadUserPhoto = multer({storage, fileFilter}).single("user_photo");