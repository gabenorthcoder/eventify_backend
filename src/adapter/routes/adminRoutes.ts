import { Router } from "express";
import { registerAdminRoute } from "./adminRoutes/adminRegistrationRoute";
import { updateAdminRoute } from "./adminRoutes/adminUpdateUserRoute";
import { listAdminRoute } from "./adminRoutes/adminListUsersRoute";
import { deleteAdminRoute } from "./adminRoutes/adminDeleteUserRoute";

const adminRoutes = Router();

adminRoutes.use(registerAdminRoute);
adminRoutes.use(updateAdminRoute);
adminRoutes.use(listAdminRoute);
adminRoutes.use(deleteAdminRoute);

export { adminRoutes };
