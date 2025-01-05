import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserRepository } from "./repository/userRepository";
import logger from "../utils/logger";
import dotenv from "dotenv";
import { User, UserRole } from "./repository/entities/user";
import { randomHash } from "../utils/randomHash";
dotenv.config();

export class UserLoginSuccess extends User {
  token: string;
}

export class SuperAdminLoginSuccess {
  firstName: string;
  role: string;
  token: string;
}

export interface Payload {
  id: number;
  uuid: string;
  role?: UserRole;
  hash: string;
}

export interface SuperAdminPayload {
  firstName: string;
  role: string;
  hash: string;
}

const JWT_SECRET = String(process.env.JWT_SECRET);
if (!JWT_SECRET) {
  logger.error("JWT_SECRET is not defined in the environment variables.");
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}
const SUPER_ADMIN_EMAIL = String(process.env.SUPER_ADMIN_EMAIL);
if (!SUPER_ADMIN_EMAIL) {
  logger.error(
    "SUPER_ADMIN_EMAIL is not defined in the environment variables."
  );
  throw new Error(
    "SUPER_ADMIN_EMAIL is not defined in the environment variables."
  );
}
const SUPER_ADMIN_PASSWORD = String(process.env.SUPER_ADMIN_PASSWORD);
if (!SUPER_ADMIN_PASSWORD) {
  logger.error(
    "SUPER_ADMIN_PASSWORD is not defined in the environment variables."
  );
  throw new Error(
    "SUPER_ADMIN_PASSWORD is not defined in the environment variables."
  );
}

export class AuthService {
  private userRepository = new UserRepository();

  async superAdminLogin(
    loginEmail: string,
    loginPassword: string
  ): Promise<SuperAdminLoginSuccess> {
    if (
      loginEmail !== SUPER_ADMIN_EMAIL ||
      loginPassword !== SUPER_ADMIN_PASSWORD
    ) {
      throw new Error("Invalid Super Admin email or password.");
    }

    return await this.generateTokenForSuperAdmin();
  }

  async login(
    loginEmail: string,
    loginPassword: string,
    loginRole: UserRole
  ): Promise<Partial<UserLoginSuccess>> {


    const user = await this.userRepository.userExists(loginEmail, loginRole);

    if (!user) {
      logger.error(`User email:${loginEmail} not found`);
      throw new Error("Invalid email or role.");
    }


    const isPasswordValid = await bcrypt.compare(loginPassword, user.password);

    if (!isPasswordValid) {
      logger.error(`Invalid password for user ${loginEmail}`);
      throw new Error("Invalid email or password.");
    }

    return await this.generateTokenForUser(user);

  }

  async generateTokenForUser(user: User): Promise<Partial<UserLoginSuccess>> {
    const payload = this.buildUserPayload(user);

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "3h" });
    const { password, ...userWithoutPassword } = user;
    const userWithToken = {
      ...userWithoutPassword,
      token,
    };
    return userWithToken;
  }

  private async generateTokenForSuperAdmin(): Promise<SuperAdminLoginSuccess> {
    const payload = this.buildSuperAdminPayload();

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "3h" });
    const superAdmin = {
      firstName: "Super Admin",
      role: "superAdmin",
      token,
    };
    return superAdmin;
  }

  private buildUserPayload(user: User): Payload {
    return {
      id: user.id,
      uuid: user.uuid,
      role: user.role,
      hash: randomHash,
    };
  }

  private buildSuperAdminPayload(): SuperAdminPayload {
    return {
      firstName: "Super Admin",
      role: "superAdmin",
      hash: randomHash,
    };
  }
}
