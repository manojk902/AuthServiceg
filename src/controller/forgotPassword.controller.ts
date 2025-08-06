import { Request, Response } from "express";
import {
  handleForgotPassword,
  handleResetPassword,
} from "../service/forgotPassword.service";
import z from "zod";
import { forgotPasswordValidationSchema, resetPasswordValidationSchema } from "../validations/zod.validations";

// ------------------------------------------------------------------------FORGOT PASSWORD CONTROLLER
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, useRecoveryEmail } = req.body;
    await handleForgotPassword(email, useRecoveryEmail);
    res
      .status(201)
      .json({
        status: "success",
        message: `Reset password link sent to ${useRecoveryEmail ? 'recovery' : 'primary'} email`,
      });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "error", message: "Email is required" });
  }
};

// ------------------------------------------------------------------------RESET PASSWORD CONTROLLER
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = resetPasswordValidationSchema.parse(req.body);
    const { resetPasswordToken, newPassword } = validatedData;
    await handleResetPassword(resetPasswordToken, newPassword);
    res
      .status(201)
      .json({ status: "success", message: "Password reset Successfully!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: error.message,
        errors: error.issues,
      });
    }
    // Handle other errors, e.g., token expiration or invalid token
    console.error("Reset password error:", error);
    res.status(500).json({ status: "error", message: "Reset failed" });
  }
};
