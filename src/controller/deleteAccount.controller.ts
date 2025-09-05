import { deleteAccountService , recoverDeletedAccountService} from "../service/deleteAccount.service";
import { Request, Response } from "express";
import { userIdValidationSchema } from "../validations/zod.validations";
import z from "zod";

// delete user account
export const deleteUserAccount = async (req: Request,res: Response) => {
  const validatedData = userIdValidationSchema.parse(req.body) ;
  const { id } = validatedData;
  
  try {
    await deleteAccountService(id);
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
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};


// recover deleted user account
export const recoverDeletedUserAccount = async (req: Request, res: Response) => {
  const validatedData = userIdValidationSchema.parse(req.body) ;
  const { id } = validatedData;
  
  try {
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