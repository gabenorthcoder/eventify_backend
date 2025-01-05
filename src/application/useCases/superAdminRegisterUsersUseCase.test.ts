import { SuperAdminRegisterUserUseCase } from "./superAdminRegisterUsersUseCase";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import bcrypt from "bcryptjs";
import { UserRegistrationInput } from "../../domain/registerUser";

jest.mock("../../infrastructure/repository/userRepository");
jest.mock("bcryptjs");

describe("SuperAdminRegisterUserUseCase", () => {
    let userRepository: jest.Mocked<UserRepository>;
    let useCase: SuperAdminRegisterUserUseCase;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        useCase = new SuperAdminRegisterUserUseCase();
        (useCase as any).userRepository = userRepository;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should throw an error if the user already exists", async () => {
        userRepository.userExists.mockResolvedValue({ id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User);

        const userData: UserRegistrationInput = {
            email: "test@example.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.ADMIN,
        };

        await expect(useCase.execute(userData)).rejects.toThrow(
            `User with ${userData.email} already exists`
        );
    });

    it("should create a new user if the user does not exist", async () => {
        userRepository.userExists.mockResolvedValue(null);
        userRepository.createUser.mockResolvedValue({
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.ADMIN,
        });

        const hashedPassword = "hashedPassword123";
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

        const userData: UserRegistrationInput = {
            email: "test@example.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.ADMIN,
        };

        const result = await useCase.execute(userData);

        expect(userRepository.userExists).toHaveBeenCalledWith(
            userData.email,
            userData.role
        );
        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
        expect(userRepository.createUser).toHaveBeenCalledWith(
            expect.objectContaining({
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
            })
        );
        expect(result).toEqual({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
        });
    });
});