import { SuperAdminDeleteUsersUseCase } from "./superAdminDeleteUsersUseCase";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User } from "../../infrastructure/repository/entities/user";
import logger from "../../utils/logger";

jest.mock("../../infrastructure/repository/userRepository");
jest.mock("../../utils/logger");

describe("SuperAdminDeleteUsersUseCase", () => {
    let userRepository: jest.Mocked<UserRepository>;
    let superAdminDeleteUsersUseCase: SuperAdminDeleteUsersUseCase;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        superAdminDeleteUsersUseCase = new SuperAdminDeleteUsersUseCase();
        superAdminDeleteUsersUseCase["userRepository"] = userRepository;
    });

    it("should delete user if user exists", async () => {
        const userId = 1;
        userRepository.findUserById.mockResolvedValue({ id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User,);
        userRepository.deleteUser.mockResolvedValue();

        await superAdminDeleteUsersUseCase.execute(userId);

        expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
        expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
    });

  
});