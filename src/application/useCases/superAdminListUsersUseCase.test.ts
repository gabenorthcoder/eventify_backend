import { SuperAdminListUsersUseCase } from './superAdminListUsersUseCase';
import { UserRepository } from '../../infrastructure/repository/userRepository';
import { User, UserRole } from '../../infrastructure/repository/entities/user';

jest.mock('../../infrastructure/repository/userRepository');

describe('SuperAdminListUsersUseCase', () => {
    let userRepository: jest.Mocked<UserRepository>;
    let superAdminListUsersUseCase: SuperAdminListUsersUseCase;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        superAdminListUsersUseCase = new SuperAdminListUsersUseCase();
        superAdminListUsersUseCase['userRepository'] = userRepository;
    });

    it('should return all users when no role is provided', async () => {
        const users: User[] = [
            { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User,
            { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User,
        ];
        userRepository.findAllUsers.mockResolvedValue(users);

        const result = await superAdminListUsersUseCase.execute();

        expect(userRepository.findAllUsers).toHaveBeenCalled();
        expect(result).toEqual(users);
    });


});