import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Payload, SuperAdminPayload } from "../authService";
import { User } from "../repository/entities/user";
import { UserRepository } from "../repository/userRepository";
import logger from "../../utils/logger";

dotenv.config();

const JWT_SECRET = String(process.env.JWT_SECRET);

if (!JWT_SECRET) {
  logger.error("JWT_SECRET is not defined in the environment variables.");
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export class AuthMiddlewareService {
  async verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as Payload;
   
  
      if (!decoded || !decoded.id) {
        return { valid: false };
      }
      const userRepository = new UserRepository();

      const user = await userRepository.findUserById(decoded.id);

      return { valid: true, user };
    } catch (err) {
      return { valid: false };
    }
  }
  async verifySuperAdminUserToken(token: string): Promise<{
    valid: boolean;
    superAdminUser?: { firstName: string; role: string };
  }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as SuperAdminPayload;
      const superAdminUser = {
        firstName: decoded.firstName,
        role: decoded.role,
      };
      if (!decoded) {
        return { valid: false };
      }
      return { valid: true, superAdminUser: superAdminUser };
    } catch (err) {
      return { valid: false };
    }
  }
}
