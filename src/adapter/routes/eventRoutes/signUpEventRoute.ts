import { Router } from "express";
import { signupEvent } from "../../controllers/eventAccess/signUpEvent";
import { validateToken } from "../../controllers/middleware/validateToken";
import { authorizeRole } from "../../controllers/middleware/authorizeUser";
import { UserRole } from "../../../infrastructure/repository/entities/user";

const signUpEventRoute = Router();
/**
 * @openapi
 * /events/{id}/signup:
 *   post:
 *     summary: Sign up for an event
 *     description: Allows a user to sign up for a specific event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the event to sign up for.
 *     responses:
 *       201:
 *         description: User successfully signed up for the event.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User successfully signed up for the event"
 *                 signup:
 *                   type: object
 *                   properties:
 *                     event:
 *                       type: object
 *                       description: The event details.
 *                     user:
 *                       type: object
 *                       description: The user details.
 *       400:
 *         description: Bad request or user already signed up.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is already signed up for this event"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: User not authenticated"
 *       404:
 *         description: Event not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found or is no longer active"
 */

signUpEventRoute.post(
  "/:id/signup",
  validateToken,
  authorizeRole([UserRole.USER]),
  signupEvent
);

export { signUpEventRoute };
