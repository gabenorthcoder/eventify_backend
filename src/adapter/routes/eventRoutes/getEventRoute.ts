import { Router } from "express";
import { getEvent } from "../../controllers/eventAccess/getEvent";

const getEventRoute = Router();

/**
 * @openapi
 * /{eventId}/event:
 *   get:
 *     summary: Fetch an event by ID
 *     description: Retrieve details of a specific event using its unique ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: Unique ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Art Workshop"
 *                 description:
 *                   type: string
 *                   example: "An engaging art workshop for all ages"
 *                 address:
 *                   type: string
 *                   example: "10 Downing Street, London, UK"
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-01-20"
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 createdBy:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     email:
 *                       type: string
 *                       example: "staff@example.com"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Failed to fetch event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch event"
 */

getEventRoute.get(
  "/:eventId/event",
  getEvent
);

export { getEventRoute };
