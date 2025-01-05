import { AdminDeleteUsersUseCase } from "./adminUserDeleteUseCase";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import logger from "../../utils/logger";

jest.mock("../../infrastructure/repository/userRepository");
jest.mock("../../utils/logger");

describe("AdminDeleteUsersUseCase", () => {
    let adminDeleteUsersUseCase: AdminDeleteUsersUseCase;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        adminDeleteUsersUseCase = new AdminDeleteUsersUseCase();
        (adminDeleteUsersUseCase as any).userRepository = userRepository;
    });



    it("should throw an error if staff tries to delete admin or staff", async () => {
        userRepository.findUserById.mockResolvedValue({ id: 1, role: UserRole.ADMIN } as User);

        await expect(
            adminDeleteUsersUseCase.execute(1, { id: 2, role: UserRole.STAFF } as User)
        ).rejects.toThrow("Staff role is not allowed to delete Admin or Staff members");
    });

    it("should throw an error if admin tries to delete another admin", async () => {
        userRepository.findUserById.mockResolvedValue({ id: 1, role: UserRole.ADMIN } as User);

        await expect(
            adminDeleteUsersUseCase.execute(1, { id: 2, role: UserRole.ADMIN } as User)
        ).rejects.toThrow("Admin role is not allowed to delete another admin");
    });

    it("should delete user if all conditions are met", async () => {
        userRepository.findUserById.mockResolvedValue({ id: 1, role: UserRole.USER } as User);

        await adminDeleteUsersUseCase.execute(1, { id: 2, role: UserRole.ADMIN } as User);

        expect(userRepository.deleteUser).toHaveBeenCalledWith(1);
    });
});