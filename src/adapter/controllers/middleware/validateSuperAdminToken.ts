import { Request, Response, NextFunction } from "express";
import { AuthMiddlewareService } from "../../../infrastructure/middleware/authMiddlewareService";

declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}

export const validateSuperAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }
  const token = authHeader.split(" ")[1];
  const authMiddlewareService = new AuthMiddlewareService();
  const result = await authMiddlewareService.verifySuperAdminUserToken(token);
  if (result.valid && result.superAdminUser) {

    req.user = result.superAdminUser;
    next();
  } else {
    res
      .status(403)
      .json({ message: "Unauthorized: Invalid super admin token" });
  }
  return;
};
