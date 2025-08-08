import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "../config/pgDatabase/dbConnect";

import transporter from "../utils/transporter";

// ------------------------------------------------------------------USER SIGNUP SERVICE
export const signupUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  appName: string,
) => {
  const emailLower = email.toLowerCase();

  // Step 1: Check if user exists
  const existingUserResult = await pool.query(`SELECT * FROM users WHERE email = $1`, [emailLower]);
  let user;
  let isNewUser = false;

  if (existingUserResult.rows.length > 0) {
    user = existingUserResult.rows[0];
  } else {
    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate username and verification token
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const uniqueUsername = `${firstName.toLowerCase()}_${randomSuffix}`;
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Step 3: Insert into users table
    const insertUserQuery = `
      INSERT INTO users (username, first_name, last_name, email, password, verification_token)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const values = [uniqueUsername.toLowerCase(), firstName, lastName, emailLower, hashedPassword, verificationToken];
    const { rows } = await pool.query(insertUserQuery, values);
    user = rows[0];
    isNewUser = true;

    //  Send verification email only for new users
    console.log(`server url -> ${process.env.BASE_URL_SERVER}`)
    const verificationUrl = `${process.env.BASE_URL_SERVER}/api/v1/auth/verify-email?emailVerifyToken=${verificationToken}`;
    await sendVerificationEmail(user.email, verificationUrl);
  }

  // Step 4: Insert into user_app if not already exists
  const userAppExists = await pool.query(
    `SELECT * FROM user_app WHERE user_id = $1 AND app_name = $2`,
    [user.id, appName, ]
  );

  if (userAppExists.rows.length === 0) {
    await pool.query(
      `INSERT INTO user_app (user_id, app_name) VALUES ($1, $2)`,
      [user.id, appName ]
    );
  }

  return user;
};

// ----------------------------------------SEND VERIFICATION EMAIL
const sendVerificationEmail = async (to: string, url: string) => {
  transporter;

  await transporter.sendMail({
    from: `"DriveOSx" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Verify your email",
    html: `<p>Please verify your email by clicking <a href="${url}" > Click to Verify </a>   </p>`,
  });
};

// ----------------------------------------GET USER BY ID
export const getUserById = async (id: number)=>{
  const query = await pool.query(`SELECT username, first_name, last_name, email, recovery_email, phone_number FROM users WHERE id = $1 AND is_deleted=$2`, [id,'false']);
  return query.rows[0];
}