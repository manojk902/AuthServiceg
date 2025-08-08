import { Request, Response } from "express";
import { updateUserInfoValidationSchema } from "../validations/zod.validations";
import z from "zod";
import { updateUserInfoById } from "../service/userInfo.service";

// -----------------------------------------UPDATE USER INFO
export const updateUserInfoController = async (req: Request, res: Response) => {
    try {
        const validatedData = updateUserInfoValidationSchema.parse(req.body);
        const { id, user_photo, dob, gender, home_address, work_address } = validatedData;
        const updatedUserInfo = await updateUserInfoById(id, { user_photo, dob, gender, home_address, work_address });
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