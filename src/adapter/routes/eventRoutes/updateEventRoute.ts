import { Router } from "express";
import { validateToken } from "../../controllers/middleware/validateToken";
import { authorizeRole } from "../../controllers/middleware/authorizeUser";
import { updateEvent } from "../../controllers/eventAccess/updateEvents";
import { UserRole } from "../../../infrastructure/repository/entities/user";

const updateEventRoute = Router();

/**
 * @openapi
 * /events/{id}/update:
 *   put:
 *     summary: Update event details
 *     description: Allows staff to update all fields of an event, including the active status.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the event to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Art Workshop"
 *               description:
 *                 type: string
 *                 example: "An updated description for the art workshop."
 *               address:
 *                 type: string
 *                 example: "10 Downing Street, London, UK"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-25"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Event not found.
 */
updateEventRoute.put(
  "/:id/update",
  validateToken,
  authorizeRole([UserRole.STAFF, UserRole.ADMIN]),
  updateEvent
);

export { updateEventRoute };
