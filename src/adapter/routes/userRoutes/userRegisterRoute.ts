import { Router } from "express";
import { registerUser } from "../../controllers/userAccess/registerUserController";

const registerRoute = Router();
/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details.
 *     tags:
 *       - Users
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
registerRoute.post("/register", registerUser);

export { registerRoute };
