import { adminDeleteUser } from "../../controllers/adminAccess/deleteAdminUserController";
import { Router } from "express";
import { validateToken } from "../../controllers/middleware/validateToken";
import { authorizeRole } from "../../controllers/middleware/authorizeUser";
import { UserRole } from "../../../infrastructure/repository/entities/user";

const deleteAdminRoute = Router();
/**
 * @openapi
 * /admin/{id}/delete:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Allows an admin or staff to delete a user by their ID.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to be deleted.
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       400:
 *         description: Invalid ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid ID supplied"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */

deleteAdminRoute.delete(
  "/:id/delete",
  validateToken,
  authorizeRole([UserRole.ADMIN, UserRole.STAFF]),
  adminDeleteUser
);

export { deleteAdminRoute };
