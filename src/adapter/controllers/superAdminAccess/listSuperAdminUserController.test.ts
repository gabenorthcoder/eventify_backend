import request from 'supertest';
import express from 'express';
import { listAllUsersAsSuperAdmin } from './listSuperAdminUserController';
import { SuperAdminListUsersUseCase } from '../../../application/useCases/superAdminListUsersUseCase';

jest.mock('../../../application/useCases/superAdminListUsersUseCase');

const app = express();
app.use(express.json());
app.use('/superadmin', listAllUsersAsSuperAdmin);

describe('listSuperAdminUserController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and a list of users when no role is provided', async () => {
        const mockUsers = [{ id: 1, name: 'User1' }, { id: 2, name: 'User2' }];
        SuperAdminListUsersUseCase.prototype.execute = jest.fn().mockResolvedValue(mockUsers);

        const response = await request(app).get('/superadmin/list');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
        expect(SuperAdminListUsersUseCase.prototype.execute).toHaveBeenCalledWith();
    });

    it('should return 200 and a user when a valid role is provided', async () => {
        const mockUser = { id: 1, name: 'User1' };
        SuperAdminListUsersUseCase.prototype.execute = jest.fn().mockResolvedValue(mockUser);

        const response = await request(app).get('/superadmin/1/list');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
        expect(SuperAdminListUsersUseCase.prototype.execute).toHaveBeenCalledWith(1);
    });

    it('should return 400 when an invalid role is provided', async () => {
        const response = await request(app).get('/superadmin/invalid/list');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid Role. It must be a positive integer greater than 0.',
        });
        expect(SuperAdminListUsersUseCase.prototype.execute).not.toHaveBeenCalled();
    });

    it('should return 401 when an error occurs in the use case', async () => {
        SuperAdminListUsersUseCase.prototype.execute = jest.fn().mockRejectedValue(new Error('Use case error'));

        const response = await request(app).get('/superadmin/list');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Use case error' });
    });
});