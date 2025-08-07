import { suspendAccountService, reactivateSuspendedAccountService } from "../service/suspendAccount.service";
import { Request, Response } from "express";
import { suspendAccountValidationSchema, userIdValidationSchema } from "../validations/zod.validations";
import z from "zod";

// suspend user account
export const suspendUserAccount = async (req: Request, res: Response) => {
  const validatedData = suspendAccountValidationSchema.parse(req.body) ;
  const { id, suspendReason } = validatedData;
  const userId = parseInt(id);

  if (!userId || !suspendReason) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID and suspendReason are required" });
  }

  try {
    await suspendAccountService(userId, suspendReason);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account suspended successfully",
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
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
}

// reactivate suspended user account
export const reactivateSuspendedUserAccount = async (req: Request, res: Response) => {
  const validatedData = userIdValidationSchema.parse(req.body) ;
  const { id } = validatedData;
  const userId = parseInt(id);

  try {
    await reactivateSuspendedAccountService(userId);
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
        errors: error.issues 
      });
    }
    console.error("Reactivation error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
}