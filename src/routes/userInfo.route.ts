import { Request, Response } from "express";    
import { updateUserInfoController } from "../controller/userInfo.controller";   
import { Router } from "express";

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

router.put('/update-user-info', (req:Request, res:Response)=>{
    updateUserInfoController(req, res);
});

export default router;