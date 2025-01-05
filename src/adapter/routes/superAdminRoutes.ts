import { Router } from "express";
import { superAdminloginRoute } from "./superAdminRoutes/superAdminLoginRoute";
import { superAdminRegistrationRoute } from "./superAdminRoutes/superAdminRegistrationRoute";
import { superAdminDeleteRoute } from "./superAdminRoutes/superAdminDeleteRoute";
import { superAdminListRoute } from "./superAdminRoutes/superAdminListRoute";
import { superAdminUpdateRoute } from "./superAdminRoutes/superAdminUpdateRoute";

const superAdminRoutes = Router();

superAdminRoutes.use(superAdminloginRoute);
superAdminRoutes.use(superAdminRegistrationRoute);
superAdminRoutes.use(superAdminDeleteRoute);
superAdminRoutes.use(superAdminListRoute);
superAdminRoutes.use(superAdminUpdateRoute);

export { superAdminRoutes };
