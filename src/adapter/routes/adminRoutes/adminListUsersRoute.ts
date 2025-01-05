import { listAdminUsers } from "../../controllers/adminAccess/listAdminUserController";
import { Router } from "express";
import { validateToken } from "../../controllers/middleware/validateToken";
import { authorizeRole } from "../../controllers/middleware/authorizeUser";
import { UserRole } from "../../../infrastructure/repository/entities/user";

const listAdminRoute = Router();
/**
 * @openapi
 * /admin/{role}/list:
 *   get:
 *     summary: List all users for a specific role
 *     description: Allows an admin or staff to list all users with a specific role.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - ADMIN
 *             - STAFF
 *             - USER
 *         description: The role of users to be listed (ADMIN, STAFF, USER).
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the user.
 *                   firstName:
 *                     type: string
 *                     description: The user's first name.
 *                     example: "Jane"
 *                   lastName:
 *                     type: string
 *                     description: The user's last name.
 *                     example: "Smith"
 *                   email:
 *                     type: string
 *                     description: The user's email address.
 *                     example: "jane.smith@example.com"
 *                   role:
 *                     type: string
 *                     enum:
 *                       - ADMIN
 *                       - STAFF
 *                       - USER
 *                     description: The user's role.
 *                     example: "STAFF"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access"
 *       404:
 *         description: No users found for the specified role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users found for this role"
 */

listAdminRoute.get(
  "/:role?/list",
  validateToken,
  authorizeRole([UserRole.ADMIN, UserRole.STAFF]),
  listAdminUsers
);

export { listAdminRoute };
