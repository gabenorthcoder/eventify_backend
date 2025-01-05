import { RegisterAdminUseCase } from "./registerAdminUserCase";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import bcrypt from "bcryptjs";

jest.mock("../../infrastructure/repository/userRepository");
jest.mock("bcryptjs");

describe("RegisterAdminUseCase", () => {
    let registerAdminUseCase: RegisterAdminUseCase;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        registerAdminUseCase = new RegisterAdminUseCase();
        (registerAdminUseCase as any).userRepository = userRepository;
    });

    it("should throw an error if a staff tries to register an admin or staff", async () => {
        const userData = { email: "test@example.com", password: "password", firstName: "Test", role: UserRole.ADMIN };
        const user = { role: UserRole.STAFF } as User;

        await expect(registerAdminUseCase.execute(userData, user)).rejects.toThrow(
            "Staff role is not allowed to register Admin or Staff members"
        );
    });

    it("should throw an error if an admin tries to register another admin", async () => {
        const userData = { email: "test@example.com", password: "password", firstName: "Test", role: UserRole.ADMIN };
        const user = { role: UserRole.ADMIN } as User;

        await expect(registerAdminUseCase.execute(userData, user)).rejects.toThrow(
            "Admin role is not allowed to register another admin"
        );
    });

    it("should throw an error if the user already exists", async () => {
        const userData = { email: "test@example.com", password: "password", firstName: "Test", role: UserRole.USER };
        const user = { role: UserRole.ADMIN } as User;

        userRepository.userExists.mockResolvedValue({ id: 2, uuid: "updater-uuid", email: "updater@example.com", password: "hashed-password", firstName: "Updater", lastName: "User" } as User);

        await expect(registerAdminUseCase.execute(userData, user)).rejects.toThrow(
            `User with ${userData.email} already exists`
        );
    });

    it("should create a new user if all conditions are met", async () => {
        const userData = { email: "test@example.com", password: "password", firstName: "Test", role: UserRole.USER };
        const user = { role: UserRole.ADMIN } as User;
        const hashedPassword = "hashedPassword";
        const createdUser = { id: 1, email: userData.email, role: userData.role } as Partial<User>;

        userRepository.userExists.mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
        userRepository.createUser.mockResolvedValue(createdUser);

        const result = await registerAdminUseCase.execute(userData, user);

        expect(result).toEqual(createdUser);
        expect(userRepository.userExists).toHaveBeenCalledWith(userData.email, userData.role);
        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
        expect(userRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            role: userData.role,
        }));
    });
});