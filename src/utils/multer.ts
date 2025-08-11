import multer from "multer";

const storage = multer.diskStorage({
    destination:"uploads/",
    filename:(req, file, cb)=>{
        const uniqueName = Date.now()+"-"+file.originalname;
        cb(null, uniqueName)
    }
})

const fileFilter = (req:Express.Request, file:Express.Multer.File, cb:multer.FileFilterCallback)=>{
    const allowedTypes = ["image/jpeg","image/jpg","image/png"];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new Error("Only .jpeg, .jpg, .png files are allowed"))
    }
}

export const upload = multer({storage, fileFilter});