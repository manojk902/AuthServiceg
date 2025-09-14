import { Request, Response } from "express";
import { updateUserInfoValidationSchema, userIdValidationSchema } from "../validations/zod.validations";
import z from "zod";
import { getUserInfoById, getUserPhotoById, updateUserInfoById, updateUserPhotoById } from "../service/userInfo.service";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

// -----------------------------------------UPDATE USER INFO
export const updateUserInfoController = async (req: Request, res: Response) => {
    try {
        let userPhotoPath = null;
        if(req.file){
            const cloudinaryResult = await uploadToCloudinary(req.file.buffer, "auth_user_Photos")
            userPhotoPath = cloudinaryResult.secure_url;
        }
        const validatedData = updateUserInfoValidationSchema.parse({...req.body, user_photo :userPhotoPath});
        const { id, dob, gender, home_address, work_address } = validatedData;
        const updatedUserInfo = await updateUserInfoById(id, {  dob, gender, home_address, work_address });
        if (!updatedUserInfo) {
            return res.status(404).json({ status: "user_not_found", message: "User not found" });
        }
        return res.status(200).json({
            status: "success", message: "User info updated successfully", userInfo: {
                id: updatedUserInfo.user_id,
                user_photo: updatedUserInfo.user_photo,
                dob: updatedUserInfo.dob,
                gender: updatedUserInfo.gender,
                home_address: updatedUserInfo.home_address,
                work_address: updatedUserInfo.work_address,
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: error.issues
            });
        }
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

// -----------------------------------------GET USER INFO BY ID
export const getUserInfoByIdController = async (req:Request, res:Response)=>{
    try {
        const validatedData = userIdValidationSchema.parse(req.params);
        const { id } = validatedData;
        const userInfo = await getUserInfoById(id);
        if (!userInfo) {
            return res.status(404).json({ status: "user_not_found", message: "UserInfo not found" });
        }
        return res.status(200).json({
            status: "success",
            message: "User info fetched successfully",
            userInfo: {
                user_photo: userInfo.user_photo,
                dob: userInfo.dob,
                gender: userInfo.gender,
                home_address: userInfo.home_address,
                work_address: userInfo.work_address,
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: error.issues
            });
        }
        console.error("Error fetching user info by ID:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

// -----------------------------------------UPDATE USER PHOTO
export const updateUserPhotoController = async (req: Request, res: Response) => {
    try {
        let userPhotoPath = "" ;
        if(req.file){
            const cloudinaryResult = await uploadToCloudinary(req.file.buffer, "auth_user_Photos")
            userPhotoPath = cloudinaryResult.secure_url;
        }
        const validatedData = userIdValidationSchema.parse(req.body);
        const { id} = validatedData;
        const updatedUserPhoto = await updateUserPhotoById(id, userPhotoPath);
        if (!updatedUserPhoto) {
            return res.status(400).json({ status: "user_not_found", message: "User Photo not found" });
        }
        return res.status(200).json({
            status: "success", message: "User Photo updated successfully", userPhoto:updatedUserPhoto.user_photo
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: error.issues
            });
        }
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}


// -----------------------------------------GET USER PHOTO BY ID
export const getUserPhotoByIdController = async (req:Request, res:Response)=>{
    try {
        const validatedData = userIdValidationSchema.parse(req.params);
        const { id } = validatedData;
        const userPhoto = await getUserPhotoById(id);
        if (!userPhoto) {
            return res.status(400).json({ status: "user_not_found", message: "UserPhoto not found" });
        }
        return res.status(200).json({
            status: "success",
            message: "User Photo fetched successfully",
            userPhoto:userPhoto.user_photo
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: error.issues
            });
        }
        console.error("Error fetching user info by ID:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}
