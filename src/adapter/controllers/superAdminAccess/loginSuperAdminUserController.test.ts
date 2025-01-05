import request from 'supertest';
import express from 'express';
import { superAdminUser } from './loginSuperAdminUserController';
import { SuperLoginAdminUseCase } from '../../../application/useCases/loginSuperAdminUseCase';
import { isAdminLoginBody } from '../../../domain/loginSuperAdmin';
import { formatZodError } from '../../../utils/requestChecker';

jest.mock('../../../application/useCases/loginSuperAdminUseCase');
jest.mock('../../../domain/loginSuperAdmin');
jest.mock('../../../utils/requestChecker');

const app = express();
app.use(express.json());
app.use('/super-admin', superAdminUser);

describe('POST /super-admin/login', () => {
    it('should return 400 if request body is invalid', async () => {
        (isAdminLoginBody as jest.Mock).mockReturnValue({ success: false, error: 'Invalid body' });
        (formatZodError as jest.Mock).mockReturnValue({ message: 'Invalid body' });

        const response = await request(app)
            .post('/super-admin/login')
            .send({ invalid: 'body' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid body' });
    });

    it('should return 200 and login the super admin if request body is valid', async () => {
        const validBody = { username: 'admin', password: 'password' };
        const loggedSuperAdmin = { id: 1, username: 'admin' };

        (isAdminLoginBody as jest.Mock).mockReturnValue({ success: true, data: validBody });
        (SuperLoginAdminUseCase.prototype.execute as jest.Mock).mockResolvedValue(loggedSuperAdmin);

        const response = await request(app)
            .post('/super-admin/login')
            .send(validBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Login successful', loggedSuperAdmin });
    });

    it('should return 401 if an error occurs during login', async () => {
        const validBody = { username: 'admin', password: 'password' };

        (isAdminLoginBody as jest.Mock).mockReturnValue({ success: true, data: validBody });
        (SuperLoginAdminUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Login failed'));

        const response = await request(app)
            .post('/super-admin/login')
            .send(validBody);

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Login failed' });
    });
});