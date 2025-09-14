import { deleteAccountService, recoverDeletedAccountService } from "../service/deleteAccount.service";
import { Request, Response } from "express";
import { userDeleteValidationSchema, userIdValidationSchema } from "../validations/zod.validations";
import z from "zod";

// delete user account
export const deleteUserAccount = async (req: Request, res: Response) => {

  try {
    const validatedData = userDeleteValidationSchema.parse(req.body);
    const { id, deleteText } = validatedData;

    await deleteAccountService(id, deleteText);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account deleted successfully",
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.issues
      });
    }

    if (error instanceof Error && error.message === "Invalid confirmation text") {
      return res.status(400).json({
        status: "error",
        message: "Invalid confirmation text",
      });
    }

    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};


// recover deleted user account
export const recoverDeletedUserAccount = async (req: Request, res: Response) => {


  try {
    const validatedData = userIdValidationSchema.parse(req.body);
    const { id } = validatedData;
    await recoverDeletedAccountService(id);
    return res
      .status(200)
      .json({
        status: "success",
        message: "User account recovered successfully",
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