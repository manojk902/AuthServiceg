import { Request, Response } from "express";    
import { getUserPhotoByIdController, updateUserInfoController, updateUserPhotoController } from "../controller/userInfo.controller";   
import { Router } from "express";
import {getUserInfoByIdController} from "../controller/userInfo.controller";
import { uploadUserPhoto } from "../utils/multer";
const router = Router();

/**
 * @swagger
 * /update-user-info:
 *   put:
 *     summary: Update user profile information
 *     description: Updates optional profile details for a specific user.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: User ID (must be greater than 0)
 *               user_photo:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *                 description: URL of the user's profile photo
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1995-06-15"
 *                 description: Date of birth (YYYY-MM-DD)
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: "Male"
 *                 description: Gender of the user
 *               home_address:
 *                 type: string
 *                 example: "123 Main Street, Mumbai"
 *                 description: Home address
 *               work_address:
 *                 type: string
 *                 example: "456 Corporate Ave, Delhi"
 *                 description: Work address
 *     responses:
 *       200:
 *         description: User info updated successfully
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
 *                   example: User info updated successfully
 *                 userInfo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_photo:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     dob:
 *                       type: string
 *                       format: date
 *                       example: "1995-06-15"
 *                     gender:
 *                       type: string
 *                       example: "Male"
 *                     home_address:
 *                       type: string
 *                       example: "123 Main Street, Mumbai"
 *                     work_address:
 *                       type: string
 *                       example: "456 Corporate Ave, Delhi"
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
 *                     properties:
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                       message:
 *                         type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: user_not_found
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */

router.put('/update-user-info', uploadUserPhoto, (req:Request, res:Response)=>{
    updateUserInfoController(req, res);
});


/**
 * @swagger
 * /get-user-info/{id}:
 *   get:
 *     summary: Get user info by user ID
 *     description: Fetches user details such as photo, date of birth, gender, and addresses by user ID.
 *     tags:
 *       - User Info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the user to fetch
 *     responses:
 *       200:
 *         description: User info fetched successfully
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
 *                   example: User info fetched successfully
 *                 userInfo:
 *                   type: object
 *                   properties:
 *                     user_photo:
 *                       type: string
 *                       nullable: true
 *                       example: "https://example.com/photo.jpg"
 *                     dob:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                       example: "1990-05-20"
 *                     gender:
 *                       type: string
 *                       enum: [Male, Female, Other]
 *                       nullable: true
 *                       example: Male
 *                     home_address:
 *                       type: string
 *                       nullable: true
 *                       example: "123 Main Street"
 *                     work_address:
 *                       type: string
 *                       nullable: true
 *                       example: "456 Office Park"
 *       400:
 *         description: Validation failed (invalid ID format)
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
 *                     properties:
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["id"]
 *                       message:
 *                         type: string
 *                         example: User ID is required
 *       404:
 *         description: User info not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: user_not_found
 *                 message:
 *                   type: string
 *                   example: UserInfo not found
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
 *                   example: Internal server error
 */

router.get('/get-user-info/:id', (req:Request, res:Response)=>{
    getUserInfoByIdController(req, res);
});


/**
 * @swagger
 * /update-user-photo:
 *   put:
 *     summary: Update a user's profile photo
 *     description: Upload a new profile photo for the specified user.
 *     tags:
 *       - Users
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: id
 *         type: integer
 *         required: true
 *         description: ID of the user whose photo will be updated.
 *       - in: formData
 *         name: user_photo
 *         type: file
 *         required: true
 *         description: The image file to upload as the user photo.
 *     responses:
 *       200:
 *         description: User photo updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: success
 *             message:
 *               type: string
 *               example: User Photo updated successfully
 *             userPhoto:
 *               type: string
 *               example: http://localhost:2000/uploads/1754908397358-demo_user2.png
 *       400:
 *         description: Validation failed or user not found
 *       500:
 *         description: Internal server error
 */

router.put('/update-user-photo', uploadUserPhoto,(req:Request, res:Response)=>{
    updateUserPhotoController(req, res);
})


/**
 * @swagger
 * /get-user-photo/{id}:
 *   get:
 *     summary: Get user photo by user ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose photo you want to retrieve
 *     responses:
 *       200:
 *         description: User photo fetched successfully
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
 *                   example: User Photo fetched successfully
 *                 userPhoto:
 *                   type: string
 *                   example: http://192.168.0.3:2000/uploads/1754908397358-demo_user2.png
 *       400:
 *         description: User not found or validation failed
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
 *                   example: UserPhoto not found
 *       500:
 *         description: Internal server error
 */

router.get('/get-user-photo/:id',(req:Request, res:Response)=>{
    getUserPhotoByIdController(req, res)
})

export default router;