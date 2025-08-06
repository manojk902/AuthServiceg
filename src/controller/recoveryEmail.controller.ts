import { recoveryEmailService } from "../service/recoveryEmail.service";
import { Request, Response } from "express";
import { recoveryEmailValidationSchema } from "../validations/zod.validations";
import z from "zod";

// Handle recovery email request
export const recoveryUserEmail = async (req:Request, res:Response)=>{
  try {
    const validatedData = recoveryEmailValidationSchema.parse(req.body);
    const { id, recoveryEmail } = validatedData;
    const userId = parseInt(id);
    
    if (!userId || !recoveryEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "User ID and recovery email are required" });
    }

    await recoveryEmailService(userId, recoveryEmail);
    
    return res
      .status(200)
      .json({ status: "success", message: "Recovery email updated successfully" });
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
      .json({ status: "error", message: "Internal server error" });
  }
}