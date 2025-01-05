import { RegisterUserUseCase } from "./registerUserUseCase";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import bcrypt from "bcryptjs";

jest.mock("../../infrastructure/repository/userRepository");
jest.mock("bcryptjs");

describe("RegisterUserUseCase", () => {
    let registerUserUseCase: RegisterUserUseCase;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        registerUserUseCase = new RegisterUserUseCase();
        (registerUserUseCase as any).userRepository = userRepository;
    });

    it("should throw an error if the user role is ADMIN or STAFF", async () => {
        const userData = {
            email: "admin@example.com",
            password: "password",
            firstName: "Admin",
            lastName: "User",
            role: UserRole.ADMIN,
        };

        await expect(registerUserUseCase.execute(userData)).rejects.toThrow(
            "Admin and staff roles are not allowed to register"
        );
    });

    it("should throw an error if the user already exists", async () => {
        const userData = {
            email: "existing@example.com",
            password: "password",
            firstName: "Existing",
            lastName: "User",
            role: UserRole.USER,
        };

        userRepository.userExists.mockResolvedValue({ id: 2, uuid: "updater-uuid", email: "updater@example.com", password: "hashed-password", firstName: "Updater", lastName: "User" } as User);

        await expect(registerUserUseCase.execute(userData)).rejects.toThrow(
            `User with ${userData.email} already exists`
        );
    });

    it("should create a new user if the user does not exist", async () => {
        const userData = {
            email: "newuser@example.com",
            password: "password",
            firstName: "New",
            lastName: "User",
            role: UserRole.USER,
        };

        const hashedPassword = "hashedPassword";
        const createdUser = {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
        };

        userRepository.userExists.mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
        userRepository.createUser.mockResolvedValue(createdUser);

        const result = await registerUserUseCase.execute(userData);

        expect(result).toEqual(createdUser);
        expect(userRepository.userExists).toHaveBeenCalledWith(userData.email, userData.role);
        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
        expect(userRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
        }));
    });
});