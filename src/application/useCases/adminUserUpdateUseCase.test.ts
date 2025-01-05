import { AdminUpdateUserUseCase } from "./adminUserUpdateUseCase";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import bcrypt from "bcryptjs";

jest.mock("../../infrastructure/repository/userRepository");
jest.mock("bcryptjs");

describe("AdminUpdateUserUseCase", () => {
    let adminUpdateUserUseCase: AdminUpdateUserUseCase;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        adminUpdateUserUseCase = new AdminUpdateUserUseCase();
        (adminUpdateUserUseCase as any).userRepository = userRepository;
    });



    it("should throw an error if staff tries to update admin or staff", async () => {
        userRepository.findUserById.mockResolvedValue({ role: UserRole.ADMIN } as User);

        await expect(
            adminUpdateUserUseCase.execute(1, {}, { role: UserRole.STAFF } as User)
        ).rejects.toThrow("Staff role is not allowed to update Admin or Staff members");
    });

    it("should throw an error if admin tries to update another admin", async () => {
        userRepository.findUserById.mockResolvedValue({ role: UserRole.ADMIN } as User);

        await expect(
            adminUpdateUserUseCase.execute(1, {}, { role: UserRole.ADMIN } as User)
        ).rejects.toThrow("Admin role is not allowed to update another admin");
    });

    it("should throw an error if user with the same role already exists", async () => {
        userRepository.findUserById.mockResolvedValue({ email: "test@example.com", role: UserRole.USER } as User);
        userRepository.findUsersByEmail.mockResolvedValue([
            { role: UserRole.USER } as User,
            { role: UserRole.USER } as User,
        ]);

        await expect(
            adminUpdateUserUseCase.execute(1, { role: UserRole.USER }, { role: UserRole.ADMIN } as User)
        ).rejects.toThrow("User already exists as USER");
    });

    it("should hash the password if provided", async () => {
        userRepository.findUserById.mockResolvedValue({ role: UserRole.USER } as User);
        userRepository.findUsersByEmail.mockResolvedValue([{ role: UserRole.USER } as User]);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

        const updatedUser = { role: UserRole.USER, password: "hashedPassword" } as User;
        userRepository.updateUser.mockResolvedValue(updatedUser);

        const result = await adminUpdateUserUseCase.execute(
            1,
            { password: "newPassword" },
            { role: UserRole.ADMIN } as User
        );

        expect(bcrypt.hash).toHaveBeenCalledWith("newPassword", 10);
        expect(result.password).toBe("hashedPassword");
    });

    it("should update the user successfully", async () => {
        const user = { role: UserRole.USER, email: "test@example.com" } as User;
        const updatedUser = { ...user, name: "Updated Name" } as User;

        userRepository.findUserById.mockResolvedValue(user);
        userRepository.findUsersByEmail.mockResolvedValue([user]);
        userRepository.updateUser.mockResolvedValue(updatedUser);

        const result = await adminUpdateUserUseCase.execute(
            1,
            { firstName: "Updated Name" },
            { role: UserRole.ADMIN } as User
        );

        expect(result).toEqual(updatedUser);
    });
});