import { Router } from "express";
import { validateToken } from "../../controllers/middleware/validateToken";
import { authorizeRole } from "../../controllers/middleware/authorizeUser";
import { deleteEvent } from "../../controllers/eventAccess/deleteEvent";
import { UserRole } from "../../../infrastructure/repository/entities/user";

const deleteEventRoute = Router();

/**
 * @openapi
 * /events/{id}/delete:
 *   delete:
 *     summary: Delete an event
 *     description: Allows staff to permanently delete an event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the event to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       404:
 *         description: Event not found.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
deleteEventRoute.delete(
  "/:id/delete",
  validateToken,
  authorizeRole([UserRole.STAFF, UserRole.ADMIN]),
  deleteEvent
);

export { deleteEventRoute };
