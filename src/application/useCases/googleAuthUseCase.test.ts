import { GoogleAuthUseCase } from './googleAuthUseCase';
import { UserRepository } from '../../infrastructure/repository/userRepository';
import { AuthService } from '../../infrastructure/authService';
import { User, UserRole, UserAuthType } from '../../infrastructure/repository/entities/user';

jest.mock('../../infrastructure/repository/userRepository');
jest.mock('../../infrastructure/authService');

describe('GoogleAuthUseCase', () => {
    let googleAuthUseCase: GoogleAuthUseCase;
    let userRepository: jest.Mocked<UserRepository>;
    let authService: jest.Mocked<AuthService>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        authService = new AuthService() as jest.Mocked<AuthService>;
        googleAuthUseCase = new GoogleAuthUseCase();
        googleAuthUseCase['userRepository'] = userRepository;
        googleAuthUseCase['authService'] = authService;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should authenticate an existing user', async () => {
        const profile = { email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
        const user = new User();
        user.email = profile.email;
        user.firstName = profile.firstName;
        user.lastName = profile.lastName;
        user.role = UserRole.USER;
        user.authType = UserAuthType.GOOGLE;

        userRepository.findUserByEmail.mockResolvedValue(user);
        authService.generateTokenForUser.mockResolvedValue({ token: 'fake-token' });

        const result = await googleAuthUseCase.authenticateUser(profile);

        expect(userRepository.findUserByEmail).toHaveBeenCalledWith(profile.email);
        expect(authService.generateTokenForUser).toHaveBeenCalledWith(user);
        expect(result).toEqual({ token: 'fake-token' });
    });

    it('should create and authenticate a new user', async () => {
        const profile = { email: 'newuser@example.com', firstName: 'Jane', lastName: 'Doe' };
        const newUser = new User();
        newUser.email = profile.email;
        newUser.firstName = profile.firstName;
        newUser.lastName = profile.lastName;
        newUser.role = UserRole.USER;
        newUser.authType = UserAuthType.GOOGLE;

        userRepository.findUserByEmail.mockResolvedValue(null);
        userRepository.createUser.mockResolvedValue(newUser);
        authService.generateTokenForUser.mockResolvedValue({ token: 'new-fake-token' });

        const result = await googleAuthUseCase.authenticateUser(profile);

        expect(userRepository.findUserByEmail).toHaveBeenCalledWith(profile.email);
        expect(userRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            role: UserRole.USER,
            authType: UserAuthType.GOOGLE,
        }));
        expect(authService.generateTokenForUser).toHaveBeenCalledWith(newUser);
        expect(result).toEqual({ token: 'new-fake-token' });
    });
});