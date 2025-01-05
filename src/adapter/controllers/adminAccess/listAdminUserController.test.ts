import request from 'supertest';
import express from 'express';
import { listAdminUsers } from './listAdminUserController';
import { AdminListUsersUseCase } from '../../../application/useCases/listAdminUsersUseCase';
import { User } from '../../../infrastructure/repository/entities/user';

jest.mock('../../../application/useCases/listAdminUsersUseCase');

const app = express();
app.use(express.json());
app.use('/admin', listAdminUsers);

describe('GET /admin/:role?/list', () => {
    let mockUser: User;

    beforeEach(() => {
        mockUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User
    });

    it('should return 200 and list of users when role is valid', async () => {
        const mockUsers = [{ id: 2, name: 'User1' }, { id: 3, name: 'User2' }];
        (AdminListUsersUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockUsers);

        const response = await request(app)
            .get('/admin/1/list')
            .set('user', JSON.stringify(mockUser));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
    });

    it('should return 400 when role is invalid', async () => {
        const response = await request(app)
            .get('/admin/invalidRole/list')
            .set('user', JSON.stringify(mockUser));

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid Role. It must be a positive integer greater than 0.');
    });

    it('should return 200 and list of users when role is not provided', async () => {
        const mockUsers = [{ id: 2, name: 'User1' }, { id: 3, name: 'User2' }];
        (AdminListUsersUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockUsers);

        const response = await request(app)
            .get('/admin/list')
            .set('user', JSON.stringify(mockUser));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
    });

    it('should return 401 when an error occurs', async () => {
        (AdminListUsersUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

        const response = await request(app)
            .get('/admin/list')
            .set('user', JSON.stringify(mockUser));

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized');
    });
});