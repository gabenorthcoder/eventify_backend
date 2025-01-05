import { LoginUserUseCase } from './loginUserUseCase';
import { AuthService } from '../../infrastructure/authService';
import { UserLoginInput } from '../../domain/loginUser';

jest.mock('../../infrastructure/authService');

describe('LoginUserUseCase', () => {
    let loginUserUseCase: LoginUserUseCase;
    let authService: jest.Mocked<AuthService>;

    beforeEach(() => {
        authService = new AuthService() as jest.Mocked<AuthService>;
        loginUserUseCase = new LoginUserUseCase();
        (loginUserUseCase as any).authService = authService;
    });

    it('should return login success data when credentials are correct', async () => {
        const userData: UserLoginInput = {
            email: 'test@example.com',
            password: 'password123',
            role: 1,
        };

        const loginSuccess = {
            token: 'fake-jwt-token',
            user: {
                id: '1',
                email: 'test@example.com',
                role: 1,
            },
        };

        authService.login.mockResolvedValue(loginSuccess);

        const result = await loginUserUseCase.execute(userData);

        expect(result).toEqual(loginSuccess);
        expect(authService.login).toHaveBeenCalledWith(
            userData.email,
            userData.password,
            userData.role
        );
    });

    it('should throw an error when credentials are incorrect', async () => {
        const userData: UserLoginInput = {
            email: 'wrong@example.com',
            password: 'wrongpassword',
            role: 1,
        };

        authService.login.mockRejectedValue(new Error('Invalid credentials'));

        await expect(loginUserUseCase.execute(userData)).rejects.toThrow('Invalid credentials');
        expect(authService.login).toHaveBeenCalledWith(
            userData.email,
            userData.password,
            userData.role
        );
    });
});