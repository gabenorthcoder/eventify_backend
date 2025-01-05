import { AuthMiddlewareService } from "./authMiddlewareService";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/userRepository";
import { User } from "../repository/entities/user";

jest.mock("jsonwebtoken");
jest.mock("../repository/userRepository");

describe("AuthMiddlewareService", () => {
    const mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    const authMiddlewareService = new AuthMiddlewareService();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("verifyToken", () => {
        it("should return valid false if token is invalid", async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("Invalid token");
            });

            const result = await authMiddlewareService.verifyToken("invalidToken");

            expect(result).toEqual({ valid: false });
        });

        it("should return valid false if decoded token does not have id", async () => {
            (jwt.verify as jest.Mock).mockReturnValue({});

            const result = await authMiddlewareService.verifyToken("tokenWithoutId");

            expect(result).toEqual({ valid: false });
        });

   
    });

    describe("verifySuperAdminUserToken", () => {
        it("should return valid false if token is invalid", async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("Invalid token");
            });

            const result = await authMiddlewareService.verifySuperAdminUserToken("invalidToken");

            expect(result).toEqual({ valid: false });
        });

        it("should return valid true and superAdminUser if token is valid", async () => {
            const decodedToken = { firstName: "Admin", role: "superadmin" };
            (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

            const result = await authMiddlewareService.verifySuperAdminUserToken("validToken");

            expect(result).toEqual({ valid: true, superAdminUser: decodedToken });
        });
    });
});