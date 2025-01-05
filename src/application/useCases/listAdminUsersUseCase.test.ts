import { AdminListUsersUseCase } from "./listAdminUsersUseCase";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";

jest.mock("../../infrastructure/repository/userRepository");

describe("AdminListUsersUseCase", () => {
    let adminListUsersUseCase: AdminListUsersUseCase;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        adminListUsersUseCase = new AdminListUsersUseCase();
        (adminListUsersUseCase as any).userRepository = userRepository;
    });

    it("should return all normal users if logged user is STAFF and no role is provided", async () => {
        const loggedUser: User = { id: 1, role: UserRole.STAFF } as User;
        const normalUsers: User[] = [{ id: 2, role: UserRole.USER }] as User[];

        userRepository.findAllUsersByRole.mockResolvedValue(normalUsers);

        const result = await adminListUsersUseCase.execute(loggedUser);

        expect(userRepository.findAllUsersByRole).toHaveBeenCalledWith(UserRole.USER);
        expect(result).toEqual(normalUsers);
    });

    it("should throw an error if logged user is STAFF and tries to list other staff members", async () => {
        const loggedUser: User = { id: 1, role: UserRole.STAFF } as User;

        await expect(adminListUsersUseCase.execute(loggedUser, UserRole.STAFF)).rejects.toThrow(
            "Staff role is not allowed to list other staff members"
        );
    });

    it("should return all users by role if role is provided", async () => {
        const loggedUser: User = { id: 1, role: UserRole.ADMIN } as User;
        const staffUsers: User[] = [{ id: 2, role: UserRole.STAFF }] as User[];

        userRepository.findAllUsersByRole.mockResolvedValue(staffUsers);

        const result = await adminListUsersUseCase.execute(loggedUser, UserRole.STAFF);

        expect(userRepository.findAllUsersByRole).toHaveBeenCalledWith(UserRole.STAFF);
        expect(result).toEqual(staffUsers);
    });

    it("should return all users if no role is provided and logged user is ADMIN", async () => {
        const loggedUser: User = { id: 1, role: UserRole.ADMIN } as User;
        const allUsers: User[] = [
            { id: 2, role: UserRole.USER },
            { id: 3, role: UserRole.STAFF },
        ] as User[];

        userRepository.findAllUsers.mockResolvedValue(allUsers);

        const result = await adminListUsersUseCase.execute(loggedUser);

        expect(userRepository.findAllUsers).toHaveBeenCalled();
        expect(result).toEqual(allUsers);
    });
});