import { UserRepository } from './userRepository';
import { AppDataSource } from './dataSource';
import { User, UserRole } from './entities/user';
import logger from '../../utils/logger';
import { DataSource } from 'typeorm';

jest.mock('./dataSource');
jest.mock('../../utils/logger');

describe('UserRepository', () => {
    let userRepository: UserRepository;
    let mockUserRepository: any;

    beforeAll(() => {
        mockUserRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepository);
        userRepository = new UserRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAllUsers', () => {
        it('should return all users ordered by id', async () => {
            const users = [{ id: 1 }, { id: 2 }];
            mockUserRepository.find.mockResolvedValue(users);

            const result = await userRepository.findAllUsers();

            expect(mockUserRepository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
            expect(result).toEqual(users);
        });
    });

    describe('findAllUsersByRole', () => {
        it('should return all users with the specified role', async () => {
            const role = UserRole.ADMIN;
            const users = [{ id: 1, role }];
            mockUserRepository.find.mockResolvedValue(users);

            const result = await userRepository.findAllUsersByRole(role);

            expect(mockUserRepository.find).toHaveBeenCalledWith({ where: { role } });
            expect(result).toEqual(users);
        });

        it('should throw an error if the role is invalid', async () => {
            const role = 'INVALID_ROLE' as unknown as UserRole;

            await expect(userRepository.findAllUsersByRole(role)).rejects.toThrow('Invalid role');
            expect(logger.error).toHaveBeenCalledWith(`Invalid role: ${role}`);
        });
    });

    describe('findUsersByEmail', () => {
        it('should return users with the specified email', async () => {
            const email = 'test@example.com';
            const users = [{ id: 1, email }];
            mockUserRepository.find.mockResolvedValue(users);

            const result = await userRepository.findUsersByEmail(email);

            expect(mockUserRepository.find).toHaveBeenCalledWith({ where: { email } });
            expect(result).toEqual(users);
        });
    });

    describe('findUserByEmail', () => {
        it('should return a user with the specified email', async () => {
            const email = 'test@example.com';
            const user = { id: 1, email };
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await userRepository.findUserByEmail(email);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(result).toEqual(user);
        });

        it('should return null if no user is found', async () => {
            const email = 'test@example.com';
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await userRepository.findUserByEmail(email);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(result).toBeNull();
        });
    });

    describe('userExists', () => {
        it('should return a user if they exist with the specified email and role', async () => {
            const email = 'test@example.com';
            const role = UserRole.ADMIN;
            const user = { id: 1, email, role };
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await userRepository.userExists(email, role);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email, role } });
            expect(result).toEqual(user);
        });

        it('should return null if no user is found', async () => {
            const email = 'test@example.com';
            const role = UserRole.ADMIN;
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await userRepository.userExists(email, role);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email, role } });
            expect(result).toBeNull();
        });
    });

    describe('findUserById', () => {
        it('should return a user with the specified id', async () => {
            const userId = 1;
            const user = { id: userId };
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await userRepository.findUserById(userId);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
            expect(result).toEqual(user);
        });

        it('should throw an error if no user is found', async () => {
            const userId = 1;
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(userRepository.findUserById(userId)).rejects.toThrow('User not found');
            expect(logger.error).toHaveBeenCalledWith(`User id:${userId} not found`);
        });
    });

    describe('createUser', () => {
        it('should create and save a new user', async () => {
            const userRegistrationData = { email: 'test@example.com', password: 'password' };
            const savedUser = { id: 1, email: 'test@example.com', password: 'password' };
            mockUserRepository.create.mockReturnValue(savedUser);
            mockUserRepository.save.mockResolvedValue(savedUser);

            const result = await userRepository.createUser(userRegistrationData);

            expect(mockUserRepository.create).toHaveBeenCalledWith(userRegistrationData);
            expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
            expect(result).toEqual({ id: 1, email: 'test@example.com' });
        });
    });

    describe('updateUser', () => {
        it('should update and save the user', async () => {
            const user = { id: 1, email: 'test@example.com' } as Partial<User>;
            mockUserRepository.save.mockResolvedValue(user);

            const result = await userRepository.updateUser(user);

            expect(mockUserRepository.save).toHaveBeenCalledWith(user);
            expect(result).toEqual(user);
        });
    });

    describe('deleteUser', () => {
        it('should delete the user with the specified id', async () => {
            const userId = 1;
            mockUserRepository.delete.mockResolvedValue(undefined);

            await userRepository.deleteUser(userId);

            expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
        });
    });
});