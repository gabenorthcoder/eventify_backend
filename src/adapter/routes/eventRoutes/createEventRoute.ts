import { Router } from "express";
import { validateToken } from "../../controllers/middleware/validateToken";
import { authorizeRole } from "../../controllers/middleware/authorizeUser";
import { createEvent } from "../../controllers/eventAccess/createEvent";
import { UserRole } from "../../../infrastructure/repository/entities/user";

const createEventRouter = Router();
/**
 * @openapi
 * /events/create:
 *   post:
 *     summary: Create a new event
 *     description: Allows a staff member to create a new event. Only users with the STAFF role can access this endpoint.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Art Workshop"
 *                 description: "The title of the event"
 *               description:
 *                 type: string
 *                 example: "An engaging art workshop for all ages"
 *                 description: "Details about the event"
 *               address:
 *                 type: string
 *                 example: "10 Downing Street, London, UK"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-20"
 *                 description: "The date of the event in YYYY-MM-DD format"
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event created successfully"
 *                 event:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: "The unique identifier for the event"
 *                     title:
 *                       type: string
 *                       example: "Art Workshop"
 *                       description: "The title of the event"
 *                     description:
 *                       type: string
 *                       example: "An engaging art workshop for all ages"
 *                       description: "Details about the event"
 *                     address:
 *                       type: string
 *                       example: "10 Downing Street, London, UK"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-20"
 *                       description: "The date of the event in YYYY-MM-DD format"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                       description: "Indicates if the event is active"
 *                     createdBy:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                           description: "The unique identifier of the staff member who created the event"
 *                         email:
 *                           type: string
 *                           example: "staff@example.com"
 *                           description: "The email of the staff member who created the event"
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Title is required"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: You do not have access to this resource"
 */

createEventRouter.post(
  "/create",
  validateToken,
  authorizeRole([UserRole.STAFF, UserRole.ADMIN]),
  createEvent
);
export { createEventRouter };
