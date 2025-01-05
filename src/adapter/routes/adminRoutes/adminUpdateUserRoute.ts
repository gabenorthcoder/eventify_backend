import { Router } from "express";
import { updateAdminUser } from "../../controllers/adminAccess/updateAdminUserController";
import { validateToken } from "../../controllers/middleware/validateToken";
import { authorizeRole } from "../../controllers/middleware/authorizeUser";
import { UserRole } from "../../../infrastructure/repository/entities/user";

const updateAdminRoute = Router();

/**
 * @openapi
 * /admin/{id}/update:
 *   put:
 *     summary: Update an existing user
 *     description: Allows an admin or staff to update the details of an existing user.
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
 *         description: The ID of the user to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's updated email address.
 *                 example: "updated@example.com"
 *               password:
 *                 type: string
 *                 description: The user's new password (optional, minimum 6 characters).
 *                 example: "newpassword123"
 *               firstName:
 *                 type: string
 *                 description: The user's updated first name.
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 description: The user's updated last name.
 *                 example: "Smith"
 *               role:
 *                 type: number
 *                 enum:
 *                   - 0  # ADMIN
 *                   - 1  # STAFF
 *                   - 2  # USER
 *                 description: The user's updated role (0 = ADMIN, 1 = STAFF, 2 = USER).
 *                 example: 1
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
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

updateAdminRoute.put(
  "/:id/update",
  validateToken,
  authorizeRole([UserRole.ADMIN, UserRole.STAFF]),
  updateAdminUser
);

export { updateAdminRoute };
