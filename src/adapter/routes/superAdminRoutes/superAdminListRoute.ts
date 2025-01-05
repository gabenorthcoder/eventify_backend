import { Router } from "express";
import { listAllUsersAsSuperAdmin } from "../../controllers/superAdminAccess/listSuperAdminUserController";
import { validateSuperAdminToken } from "../../controllers/middleware/validateSuperAdminToken";
import { authorizeSuperAdminRole } from "../../controllers/middleware/authorizeSuperAdminUser";

const superAdminListRoute = Router();
/**
 * @openapi
 * /super-admin/{role}/list:
 *   get:
 *     summary: List all users by role
 *     description: Retrieve a list of users filtered by role. Defaults to listing all users if no role is provided.
 *     tags:
 *       - Super Admin
 *     parameters:
 *       - in: path
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional role to filter users (e.g., "superAdmin").
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   email:
 *                     type: string
 *                     example: "example@domain.com"
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   role:
 *                     type: string
 *                     example: "superAdmin"
 *       400:
 *         description: Invalid role parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid role provided"
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
 */

superAdminListRoute.get(
  "/:role?/list",
  validateSuperAdminToken,
  authorizeSuperAdminRole("superAdmin"),
  listAllUsersAsSuperAdmin
);

export { superAdminListRoute };
