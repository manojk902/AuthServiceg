import { Request, Response, Router } from "express";
import { getUserByIdController, signup, updateUserById, verifyEmail } from "../controller/signup.controller";
import { get } from "http";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and verification endpoints
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Register a new user. Handles existing users (verified and unverified), sends email verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - appName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123!
 *               appName:
 *                 type: string
 *                 example: PortfolioApp
 *     responses:
 *       201:
 *         description: Signup successful, verification email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Signup successful! Please check your email to verify your account.
 *       200:
 *         description: User exists but not verified, verification email resent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Already registered but not verified. Verification email resent.
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       401:
 *         description: User already exists and is verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: user_exists
 *                 message:
 *                   type: string
 *                   example: User already exists, new app access granted.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     appName:
 *                       type: string
 *                     :
 *                       type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Signup failed
 */
router.post("/signup", (req: Request, res: Response) => {
  signup(req, res);
});

/**
 * @swagger
 * /verify-email:
 *   get:
 *     summary: Verify email using token
 *     tags: [Auth]
 *     description: Verifies a user's email using a token provided in the query parameter.
 *     parameters:
 *       - in: query
 *         name: emailVerifyToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token sent to the user
 *     responses:
 *       200:
 *         description: Email verified successfully (redirects to frontend)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Redirect to frontend success page
 *       400:
 *         description: Missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Missing token
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid or expired token
 */
router.get("/verify-email", (req: Request, res: Response) => {
  verifyEmail(req, res);
});


/**
 * @swagger
 * /get-user/{id}:
 *   get:
 *     summary: Get user details by ID
 *     description: Fetches a user's details using their unique ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the user.
 *         example: 123
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User details fetched successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: mukesh123
 *                     firstName:
 *                       type: string
 *                       example: Mukesh
 *                     lastName:
 *                       type: string
 *                       example: Kumar
 *                     email:
 *                       type: string
 *                       example: mukesh@example.com
 *                     recoveryEmail:
 *                       type: string
 *                       example: mukesh.recovery@example.com
 *                     phoneNumber:
 *                       type: string
 *                       example: "+911234567890"
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get('/get-user/:id',(req:Request, res:Response)=>{
  getUserByIdController(req, res);
})


/**
 * @swagger
 * /update-user:
 *   put:
 *     summary: Update user details by ID
 *     description: Updates the details of an existing user in the system.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: User ID (required)
 *               first_name:
 *                 type: string
 *                 example: John
 *                 description: First name of the user (required)
 *               last_name:
 *                 type: string
 *                 example: Doe
 *                 description: Last name of the user (optional)
 *               email:
 *                 type: string
 *                 example: john@example.com
 *                 description: Email address (required, must be valid)
 *               recovery_email:
 *                 type: string
 *                 example: john.recovery@example.com
 *                 description: Recovery email address (optional, must be valid)
 *               phone_number:
 *                 type: string
 *                 example: 9876543210
 *                 description: Phone number (optional, must start with 6-9 and be exactly 10 digits)
 *             required:
 *               - id
 *               - first_name
 *               - email
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User details updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     recoveryEmail:
 *                       type: string
 *                       example: john.recovery@example.com
 *                     phoneNumber:
 *                       type: string
 *                       example: 9876543210
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.put('/update-user',(req:Request, res:Response)=>{
  updateUserById(req, res);
})

export default router;
