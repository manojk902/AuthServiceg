import { deleteUserAccount, recoverDeletedUserAccount } from "../controller/deleteAccount.controller";
import { Request, Response, Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
/**
 * @swagger
 * /delete-account:
 *   delete:
 *     summary: Soft delete (deactivate) a user account
 *     tags: [Auth]
 *     description: Marks a user account as deleted by setting `is_deleted = true` and `deleted_at = NOW()`. Requires confirmation text `"DELETE DRIVEOSX ACCOUNT"`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - deleteText
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the user to delete
 *                 example: 123
 *               deleteText:
 *                 type: string
 *                 description: Confirmation text that must exactly equal `"DELETE DRIVEOSX ACCOUNT"`
 *                 example: DELETE DRIVEOSX ACCOUNT
 *     responses:
 *       200:
 *         description: User account deleted successfully
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
 *                   example: User account deleted successfully
 *       400:
 *         description: Validation failed (missing fields or invalid confirmation text)
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
 *                   example: Invalid confirmation text
 *                 errors:
 *                   type: array
 *                   description: List of validation issues (if Zod validation fails)
 *                   items:
 *                     type: object
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

router.delete("/delete-account", (req: Request, res: Response) => {
  deleteUserAccount(req, res);
});

/**
 * @swagger
 * /recover-account:
 *   post:
 *     summary: Recover a deleted user account
 *     tags: [Auth]
 *     description: Restores a previously deleted user account using the user ID.
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
 *                 description: ID of the user to recover
 *                 example: 123
 *     responses:
 *       200:
 *         description: User account recovered successfully
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
 *                   example: User account recovered successfully
 *       400:
 *         description: Missing or invalid user ID
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
 *                   example: User ID is required
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
router.post("/recover-account", (req: Request, res: Response) => {
  recoverDeletedUserAccount(req, res);
});

export default router;
