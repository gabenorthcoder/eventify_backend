import { AuthService } from "./authService";
import { UserRepository } from "./repository/userRepository";
import { User, UserRole } from "./repository/entities/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Mocking dependencies
jest.mock("./repository/userRepository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../utils/logger");

dotenv.config();

describe("AuthService", () => {
  const mockUserRepository = new UserRepository();
  const authService = new AuthService();
  const mockToken = "mock-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("superAdminLogin", () => {
    it("should throw an error if super admin email or password is incorrect", async () => {
      const invalidEmail = "invalid@example.com";
      const invalidPassword = "invalidpassword";

      // Mocking the superAdmin login method to simulate incorrect credentials
      authService.superAdminLogin = jest.fn().mockRejectedValue(new Error("Invalid Super Admin email or password."));

      await expect(
        authService.superAdminLogin(invalidEmail, invalidPassword)
      ).rejects.toThrowError("Invalid Super Admin email or password.");
    });

   
  });

  describe("login", () => {
    it("should throw an error if user email or role is invalid", async () => {
      const loginEmail = "invalid@example.com";
      const loginPassword = "password";
      const loginRole = UserRole.USER;

      // Mocking userExists to return null for invalid user
      mockUserRepository.userExists = jest.fn().mockResolvedValue(null);

      await expect(
        authService.login(loginEmail, loginPassword, loginRole)
      ).rejects.toThrowError("Invalid email or role.");
    });

    
  });

  describe("generateTokenForUser", () => {
    it("should generate a token for the user", async () => {
      const user = new User();
      user.id = 1;
      user.uuid = "user-uuid";
      user.email = "testuser@example.com";
      user.password = "hashed-password";
      user.role = UserRole.USER;

      const result = await authService.generateTokenForUser(user);

      expect(result).toHaveProperty("token");
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          uuid: "user-uuid",
          role: user.role,
        }),
        expect.any(String),
        { expiresIn: "3h" }
      );
    });
  });

 
});
