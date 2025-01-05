import { Router } from "express";
import { superAdminDeleteUser } from "../../controllers/superAdminAccess/deleteSuperAdminUserController";
import { validateSuperAdminToken } from "../../controllers/middleware/validateSuperAdminToken";
import { authorizeSuperAdminRole } from "../../controllers/middleware/authorizeSuperAdminUser";

const superAdminDeleteRoute = Router();
/**
 * @openapi
 * /super-admin/list:
 *   get:
 *     summary: List all users
 *     description: Retrieve a list of users filtered by role, status, or other query parameters. Defaults to listing all users if no filters are provided.
 *     tags:
 *       - Super Admin
 *     parameters:
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: integer
 *         description: Optional role to filter users (0 = ADMIN, 1 = STAFF, 2 = USER).
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter by active status (true or false).
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
 *                     type: integer
 *                     example: 0
 *                   isActive:
 *                     type: boolean
 *                     example: true
 *       400:
 *         description: Invalid query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameter"
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
superAdminDeleteRoute.delete(
  "/:id/delete",
  validateSuperAdminToken,
  authorizeSuperAdminRole("superAdmin"),
  superAdminDeleteUser
);

export { superAdminDeleteRoute };
