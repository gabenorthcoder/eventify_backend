import { Router } from "express";
import { createEventRouter } from "./eventRoutes/createEventRoute";
import { getEventsRoute } from "./eventRoutes/getEventsRoute";
import { signUpEventRoute } from "./eventRoutes/signUpEventRoute";
import { updateEventRoute } from "./eventRoutes/updateEventRoute";
import { deleteEventRoute } from "./eventRoutes/deleteEventRoute";
import { listUserEventsRoute } from "./eventRoutes/listUserEventsRoute";
import { googleCalenderRoute } from "./eventRoutes/googleCalenderRoute";
import { getEventRoute } from "./eventRoutes/getEventRoute";


const eventRoutes = Router();

eventRoutes.use(createEventRouter);
eventRoutes.use(getEventsRoute);
eventRoutes.use(signUpEventRoute);
eventRoutes.use(updateEventRoute);
eventRoutes.use(deleteEventRoute);
eventRoutes.use(listUserEventsRoute);
eventRoutes.use(googleCalenderRoute)
eventRoutes.use(getEventRoute)

export { eventRoutes };
