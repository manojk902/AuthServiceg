import { z } from 'zod';
import { id } from 'zod/v4/locales/index.cjs';

// ----------------------------------------------SIGN UP VALIDATION
export const signupValidationSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  appName: z.coerce.string().optional(),
  email: z.string().min(1, { message: "email is required" }).email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

// ----------------------------------------------LOGIN VALIDATION
export const loginValidationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  app_name: z.coerce.string().optional(),
});

// ----------------------------------------------RECOVERY EMAIL VALIDATION
export const recoveryEmailValidationSchema = z.object({
  id: z.coerce.number().min(1, { message: "User ID is required" }),
  recoveryEmail: z.string().email({ message: "Invalid email format" })
})

// ----------------------------------------------FORGOT PASSWORD VALIDATION
export const forgotPasswordValidationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
});

// ----------------------------------------------RESET PASSWORD VALIDATION
export const resetPasswordValidationSchema = z.object({
  resetPasswordToken: z.string().min(1, { message: "Reset password token is required" }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters long" }),
});

// ----------------------------------------------USER ID VALIDATION
export const userIdValidationSchema = z.object({
  id: z.coerce.number().min(1, { message: "User ID is required" }),
});

// -----------------------------------------------USER DELETEION VALIDATION
export const userDeleteValidationSchema = z.object({
  id: z.coerce.number().min(1, { message: "User ID is required" }),
  deleteText: z.string().min(1, { message: "Delete text is required" }),
});

//-----------------------------------------------DEACTIVATE ACCOUNT VALIDATION
export const deactivateAccountValidationSchema = z.object({
  id: z.coerce.number().min(1, { message: "User ID is required" }),
  deactivateReason: z.string().min(1, { message: "Deactivation reason is required" }),
});

// -----------------------------------------------SUSPEND ACCOUNT VALIDATION
export const suspendAccountValidationSchema = z.object({
  id: z.coerce.number().min(1, { message: "User ID is required" }),
  suspendReason: z.string().min(1, { message: "Suspend reason is required" }),
});

// -----------------------------------------------UPDATE USER VALIDATION
export const updateUserValidationSchema = z.object({
  id: z.coerce.number().min(1, { message: "User ID is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string(),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
  recovery_email: z.string().email({ message: "Invalid email format" }).default("recovery@example.com"),
  phone_number: z.coerce.string().regex(/^[6-9]\d{9}$/, "Phone number must start with 6, 7, 8, or 9 and be 10 digits long")
  .default("9xxxxxxxxx")
})

// -----------------------------------------------UPDATE USER INFO VALIDATION
export const updateUserInfoValidationSchema = z.object({
  id: z.coerce.number().min(1, { message: "User ID is required" }),
  dob: z.coerce.string(),
  gender: z.enum(["Male","Female","Other","Not Specified"]).default("Not Specified"),
  home_address: z.string().default("Not Specified"),
  work_address: z.string().default("Not Specified"),
});

// ------------------------------------------------MATCH PASSWORD VALIDATION
export const matchPasswordValidation = z.object({
  email: z.string().min(1,{message:"Email is required"}).email({message:"Invalid email format"}),
  password: z.coerce.string().min(1,{message:"Password is required"})
})