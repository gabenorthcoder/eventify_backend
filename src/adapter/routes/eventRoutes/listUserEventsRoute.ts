import { Router } from "express";
import { listUserEvents } from "../../controllers/eventAccess/listUserEvents";
import { validateToken } from "../../controllers/middleware/validateToken";
import { authorizeRole } from "../../controllers/middleware/authorizeUser";
import { UserRole } from "../../../infrastructure/repository/entities/user";

const listUserEventsRoute = Router();

/**
 * @openapi
 * /events/{id}/events:
 *   get:
 *     summary: Get events signed up by the user
 *     description: Retrieve all events that the specified user has signed up for.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved events.
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
 *                   title:
 *                     type: string
 *                     example: "Art Workshop"
 *                   description:
 *                     type: string
 *                     example: "An engaging art workshop for all ages"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-01-20"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User not found.
 */
listUserEventsRoute.get(
  "/:id/list",
  validateToken,
  authorizeRole([UserRole.USER, UserRole.STAFF, UserRole.ADMIN]),
  listUserEvents
);

export { listUserEventsRoute };
