import { Router } from "express";
import { superAdminUser } from "../../controllers/superAdminAccess/loginSuperAdminUserController";

const superAdminloginRoute = Router();

/**
 * @openapi
 * /super-admin/login:
 *   post:
 *     summary: Log in a Super Admin user.
 *     description: This endpoint allows a super admin user to log in by providing their email and password.
 *     tags:
 *      - Super Admin
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
 *                 example: "example@domain.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: The JWT token for the user.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password format."
 *       401:
 *         description: Unauthorized. Incorrect email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect email or password."
 */
superAdminloginRoute.post("/login", superAdminUser);

export { superAdminloginRoute };
