import { SuperAdminUpdateUserUseCase } from "./superAdminUpdateUserUseCase";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import bcrypt from "bcryptjs";
import logger from "../../utils/logger";

jest.mock("../../infrastructure/repository/userRepository");
jest.mock("bcryptjs");
jest.mock("../../utils/logger");

describe("SuperAdminUpdateUserUseCase", () => {
    let userRepository: jest.Mocked<UserRepository>;
    let superAdminUpdateUserUseCase: SuperAdminUpdateUserUseCase;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        superAdminUpdateUserUseCase = new SuperAdminUpdateUserUseCase();
        superAdminUpdateUserUseCase["userRepository"] = userRepository;
    });

  



    it("should hash the password if provided", async () => {
        const user = { id: 1, email: "test@example.com", role: UserRole.USER } as User;
        const hashedPassword = "hashedPassword";
        userRepository.findUserById.mockResolvedValue(user);
        userRepository.findUsersByEmail.mockResolvedValue([user]);
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

        const result = await superAdminUpdateUserUseCase.execute(
            1,
            { password: "newPassword" },
            { id: 1 } as User
        );

        expect(bcrypt.hash).toHaveBeenCalledWith("newPassword", 10);

    });

    it("should update the user with the provided data", async () => {
        const user = { id: 1, email: "test@example.com", role: UserRole.USER } as User;
        const updatedUser = { ...user, firstName: "New Name" } as User;
        userRepository.findUserById.mockResolvedValue(user);
        userRepository.findUsersByEmail.mockResolvedValue([user]);
        userRepository.updateUser.mockResolvedValue(updatedUser);

        const result = await superAdminUpdateUserUseCase.execute(
            1,
            { firstName: "New Name" },
            { id: 1 } as User
        );

        expect(result).toEqual(updatedUser);
        expect(userRepository.updateUser).toHaveBeenCalledWith(expect.objectContaining({ firstName: "New Name" }));
    });
});