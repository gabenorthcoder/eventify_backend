import { Router } from "express";
import { googleCalenderAuth, googleCalenderCallBack} from "../../controllers/eventAccess/googleCalender";

const googleCalenderRoute = Router();

/**
 * @openapi
 * /auth/google/calender:
 *   get:
 *     summary: Redirect to Google for authentication
 *     description: Initiates Google OAuth2 login.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Google's login page.
 *       500:
 *         description: Internal server error.
 */
googleCalenderRoute.get("/auth/google/calender", googleCalenderAuth);

/**
 * @openapi
 * /auth/google/calender/callback:
 *   get:
 *     summary: Handle Google authentication callback
 *     description: Handles the callback after Google authentication, logs in the user, and returns a JWT.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged in successfully"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *       401:
 *         description: Unauthorized - Authentication failed.
 *       500:
 *         description: Internal server error.
 */
googleCalenderRoute.get("/auth/google/calender/callback", googleCalenderCallBack);

export { googleCalenderRoute };
