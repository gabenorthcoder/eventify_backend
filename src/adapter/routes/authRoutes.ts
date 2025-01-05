import { Router } from "express";
import { googleAuthRoute } from "./authRoutes/googleAuthRoute";

const authRoutes = Router();

authRoutes.use(googleAuthRoute);

export { authRoutes };
