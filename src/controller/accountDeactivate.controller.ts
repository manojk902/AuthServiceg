import { Request, Response } from "express";
import {
  deactivateAccount,
  reactivateAccount,
  findUserByIdService,
} from "../service/accountDeactivate.service";
import { deactivateAccountValidationSchema, userIdValidationSchema } from "../validations/zod.validations";
import z from "zod";

// deactivate user account
export const deactivateUserAccount = async (req: Request, res: Response) => {
  try {
    const validatedData = deactivateAccountValidationSchema.parse(req.body) ;
    const { id, deactivateReason } = validatedData;
    const userId = parseInt(id);
    if (!userId || !deactivateReason) {
      return res
        .status(401)
        .json({ status: "error", message: "All fields are required" });
    }
    const user = await findUserByIdService(userId);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }

    if (user.is_deactivated) {
      return res
        .status(402)
        .json({
          status: "error",
          message: "User account is already deactivated",
        });
    }
    await deactivateAccount(userId, deactivateReason);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account deactivated successfully",
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.issues // contains detailed messages
      });
    }
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", messgae: "Internal server error" });
  }
};


// reactivate user account
export const reactivateUserAccount = async (req: Request, res: Response) => {
  try {
    const validatedData = userIdValidationSchema.parse(req.body) ;
    const { id } = validatedData;
    const userId = parseInt(id);
   
    const user = await findUserByIdService(userId);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }

    if (!user.is_deactivated) {
      return res
        .status(402)
        .json({
          status: "error",
          message: "User account is already active",
        });
    }
    await reactivateAccount(userId);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account reactivated successfully",
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.issues // contains detailed messages
      });
    }
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", messgae: "Internal server error" });
  }
}