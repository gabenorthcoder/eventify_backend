import { SuperLoginAdminUseCase } from './loginSuperAdminUseCase';
import { AuthService, SuperAdminLoginSuccess } from '../../infrastructure/authService';
import { SuperAdminLoginInput } from '../../domain/loginSuperAdmin';

jest.mock('../../infrastructure/authService');

describe('SuperLoginAdminUseCase', () => {
    let superLoginAdminUseCase: SuperLoginAdminUseCase;
    let authService: jest.Mocked<AuthService>;

    beforeEach(() => {
        authService = new AuthService() as jest.Mocked<AuthService>;
        superLoginAdminUseCase = new SuperLoginAdminUseCase();
        (superLoginAdminUseCase as any).authService = authService;
    });

    it('should login super admin successfully', async () => {
        const userData: SuperAdminLoginInput = { email: 'admin@example.com', password: 'password123' };
        const loginSuccess: SuperAdminLoginSuccess = { token: 'fake-jwt-token', firstName: 'Admin', role: 'superadmin' };

        authService.superAdminLogin.mockResolvedValue(loginSuccess);

        const result = await superLoginAdminUseCase.execute(userData);

        expect(authService.superAdminLogin).toHaveBeenCalledWith(userData.email, userData.password);
        expect(result).toEqual(loginSuccess);
    });

    it('should throw an error if login fails', async () => {
        const userData: SuperAdminLoginInput = { email: 'admin@example.com', password: 'wrongpassword' };

        authService.superAdminLogin.mockRejectedValue(new Error('Invalid credentials'));

        await expect(superLoginAdminUseCase.execute(userData)).rejects.toThrow('Invalid credentials');
        expect(authService.superAdminLogin).toHaveBeenCalledWith(userData.email, userData.password);
    });
});