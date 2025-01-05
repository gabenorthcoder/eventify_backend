import { Router } from "express";
import { loginRoute } from "./userRoutes/userLoginRoute";
import { registerRoute } from "./userRoutes/userRegisterRoute";

const userRoutes = Router();
userRoutes.use(loginRoute);
userRoutes.use(registerRoute);

export { userRoutes };
