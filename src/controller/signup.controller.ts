import { getUserById, signupUser, updateUserbyId } from "../service/signup.service";
import { Request, Response } from "express";
import crypto from "crypto";
import pool from "../config/pgDatabase/dbConnect";
import {transporter} from "../utils/transporter";
import { signupValidationSchema, updateUserValidationSchema, userIdValidationSchema } from "../validations/zod.validations";
import z from "zod";

// ------------------------------------------------------------------------USER SIGNUP CONTROLLER
export const signup = async (req: Request, res: Response) => {
  try {
    const validatedData = signupValidationSchema.parse(req.body);
    const { firstName, lastName, email, password, appName } = validatedData;

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const existingUser = result.rows[0];

    if (existingUser) {
      if (!existingUser.is_verified) {
        //  Resend verification token
        const newVerificationToken = crypto.randomBytes(32).toString("hex");

        await pool.query(
          `UPDATE users SET verification_token = $1 WHERE email = $2`,
          [newVerificationToken, email]
        );

        const newVerificationUrl = `${process.env.BASE_URL_SERVER}/api/v1/auth/verify-email?emailVerifyToken=${newVerificationToken}`;
        await transporter(
          existingUser.email,
          "Verify your email",
          `<p>Please verify your email by clicking <a href="${newVerificationUrl}">Click to Verify</a></p>`
        );

        return res.status(200).json({
          status: "success",
          message: "Already registered but not verified. Verification email resent.",
        });
      }

      //  User is verified → proceed to insert into user_app if needed
      const resUser = await signupUser(firstName, lastName, email, password, appName);

      return res.status(200).json({
        status: "user_exists",
        message: "User already exists, new app access granted.",
        user: {
          id: resUser.id,
          email: resUser.email,
          username: resUser.username,
          firstName: resUser.first_name,
          lastName: resUser.last_name,
          appName: appName,
        }
      });
    }

    //  Brand new user
    await signupUser(firstName, lastName, email, password, appName);
    return res.status(201).json({
      status: "success",
      message: "Signup successful! Please check your email to verify your account.",
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.issues
      });
    }

    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


// ------------------------------------------------------------------------EMAIL VERIFICATION CONTROLLER
export const verifyEmail = async (req: Request, res: Response) => {
  const { emailVerifyToken } = req.query;
  if (!emailVerifyToken) {
    return res.redirect(`${process.env.UI_URL}/email-verification?status=failed`);
  }

  const query = `UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING *`;
  const values = [emailVerifyToken];
  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    return res.redirect(`${process.env.UI_URL}/email-verification?status=failed`);
  }

  const user = rows[0];

  //  Redirect to UI with success and user ID
  return res.redirect(`${process.env.UI_URL}/login?status=activation-success&id=${user.id}`);
};

// ------------------------------------------------------------------------GET USER BY ID CONTROLLER
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const validatedData = userIdValidationSchema.parse(req.params);
    const { id } = validatedData;
   
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        status: "user_not_found",
        message: "User not found"
      });
    }
    return res.status(200).json({
      status: "success",
      message: "User details fetched successfully",
      user: {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        recoveryEmail: user.recovery_email,
        phoneNumber: user.phone_number
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
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}


// ------------------------------------------------------------------------UPDATE USER BY ID CONTROLLER
export const updateUserById = async (req: Request, res:Response)=>{
  try {
    const validatedData = updateUserValidationSchema.parse(req.body);
    const { id, first_name, last_name, email, recovery_email, phone_number } = validatedData;

    const updatedUser = await updateUserbyId(id,{first_name, last_name, email, recovery_email, phone_number});
    if (!updatedUser) {
      return res.status(404).json({
        status: "user_not_found",
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User details updated successfully",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        recoveryEmail: updatedUser.recovery_email,
        phoneNumber: updatedUser.phone_number
      }
    });

  } catch (error) {
    if(error instanceof z.ZodError){
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.issues
      });
    }
    console.error("Error updating user by ID:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}