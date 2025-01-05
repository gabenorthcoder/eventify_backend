import { Request, Response, NextFunction } from "express";
import {
  User,
  UserRole,
} from "../../../infrastructure/repository/entities/user";

export const authorizeRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {

    const user = req.user as User;
 

    if (!user) {
      res
        .status(401)
        .json({ message: "Unauthorized: User information missing" });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        message: "Forbidden: You do not have access to this resource",
      });
      return;
    }

    next();
  };
};
