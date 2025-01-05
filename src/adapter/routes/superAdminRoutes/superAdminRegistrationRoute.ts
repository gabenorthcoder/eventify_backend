import { Router } from "express";
import { superAdminUserRegistration } from "../../controllers/superAdminAccess/registerSuperAdminUserController";
import { validateSuperAdminToken } from "../../controllers/middleware/validateSuperAdminToken";
import { authorizeSuperAdminRole } from "../../controllers/middleware/authorizeSuperAdminUser";

const superAdminRegistrationRoute = Router();
/**
 * @openapi
 * /super-admin/register:
 *   post:
 *     summary: Registers a new user
 *     description: This endpoint allows a new user to be registered with their details.
 *     tags:
 *      - Super Admin
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: "example@domain.com"
 *               password:
 *                 type: string
 *                 description: The user's password (must be at least 6 characters)
 *                 example: "password123"
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *                 example: "Doe"
 *               role:
 *                 type: number
 *                 enum:
 *                   - 0  # ADMIN
 *                   - 1  # STAFF
 *                   - 2  # USER
 *                 description: The user's role, either 0 (ADMIN), 1 (STAFF) or 2 (USER)
 *                 example: 1
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     email:
 *                       type: string
 *                       example: "example2@domain.com"
 *                     password:
 *                       type: string
 *                       example: "$2a$10$wA/WhGKRtI7l0GVww6oYiuIE.5/zvaAR2ztxJq481jiHI7nT/Ntoa"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     role:
 *                       type: integer
 *                       example: 1
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
 *                   example: "Password must be at least 6 characters long"
 */

superAdminRegistrationRoute.post(
  "/register",
  validateSuperAdminToken,
  authorizeSuperAdminRole("superAdmin"),
  superAdminUserRegistration
);


export { superAdminRegistrationRoute };
