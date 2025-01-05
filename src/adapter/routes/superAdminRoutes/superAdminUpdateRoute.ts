import { Router } from "express";
import { updateAsSuperAdminUser } from "../../controllers/superAdminAccess/updateSuperAdminUserController";
import { validateSuperAdminToken } from "../../controllers/middleware/validateSuperAdminToken";
import { authorizeSuperAdminRole } from "../../controllers/middleware/authorizeSuperAdminUser";

const superAdminUpdateRoute = Router();
/**
 * @openapi
 * /super-admin/{id}/update:
 *   put:
 *     summary: Updates an existing user
 *     description: This endpoint allows a super admin to update details of an existing user. All parameters are optional.
 *     tags:
 *       - Super Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: "updated@domain.com"
 *               password:
 *                 type: string
 *                 description: The user's password (must be at least 6 characters)
 *                 example: "newpassword123"
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *                 example: "Smith"
 *               role:
 *                 type: number
 *                 enum:
 *                   - 0  # ADMIN
 *                   - 1  # STAFF
 *                   - 2  # USER
 *                 description: The user's role, either 0 (ADMIN), 1 (STAFF), or 2 (USER)
 *                 example: 2
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     email:
 *                       type: string
 *                       example: "updated@domain.com"
 *                     firstName:
 *                       type: string
 *                       example: "Jane"
 *                     lastName:
 *                       type: string
 *                       example: "Smith"
 *                     role:
 *                       type: integer
 *                       example: 2
 *                     uuid:
 *                       type: string
 *                       example: "a2f19886-f895-4d81-81f2-bdea257e8e33"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-20T20:32:12.905Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-20T20:32:12.905Z"
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid user ID"
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

superAdminUpdateRoute.put(
  "/:id/update",
  validateSuperAdminToken,
  authorizeSuperAdminRole("superAdmin"),
  updateAsSuperAdminUser
);


export { superAdminUpdateRoute };
