import { Router } from "express";
import { registerAdminUser } from "../../controllers/adminAccess/registerAdminUserController";
import { validateToken } from "../../controllers/middleware/validateToken";
import { authorizeRole } from "../../controllers/middleware/authorizeUser";
import { UserRole } from "../../../infrastructure/repository/entities/user";

const registerAdminRoute = Router();
/**
 * @openapi
 * /admin/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password (must be at least 6 characters).
 *                 example: "password123"
 *               firstName:
 *                 type: string
 *                 description: The user's first name.
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: The user's last name.
 *                 example: "Doe"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
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
 */
registerAdminRoute.post(
  "/register",
  validateToken,
  authorizeRole([UserRole.ADMIN, UserRole.STAFF]),
  registerAdminUser
);

export { registerAdminRoute };
