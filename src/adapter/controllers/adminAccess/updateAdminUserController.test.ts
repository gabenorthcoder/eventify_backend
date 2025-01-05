import request from 'supertest';
import express from 'express';
import { updateAdminUser } from './updateAdminUserController';
import { User } from '../../../infrastructure/repository/entities/user';
import { AdminUpdateUserUseCase } from '../../../application/useCases/adminUserUpdateUseCase';
import { isUpdateUserBody } from '../../../domain/updateUser';
import { formatZodError } from '../../../utils/requestChecker';

jest.mock('../../../application/useCases/adminUserUpdateUseCase');
jest.mock('../../../domain/updateUser');
jest.mock('../../../utils/requestChecker');

const app = express();
app.use(express.json());
app.use('/admin', updateAdminUser);

describe('updateAdminUserController', () => {
    let mockUser: User;

    beforeEach(() => {
        mockUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User
        (isUpdateUserBody as jest.Mock).mockReturnValue({ success: true, data: {} });
        (AdminUpdateUserUseCase.prototype.execute as jest.Mock).mockResolvedValue({ id: 1, name: 'Updated User' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if ID is not a positive integer', async () => {
        const response = await request(app)
            .put('/admin/abc/update')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid ID. It must be a positive integer greater than 0.');
    });

    it('should return 400 if request body is invalid', async () => {
        (isUpdateUserBody as jest.Mock).mockReturnValue({ success: false, error: {} });
        (formatZodError as jest.Mock).mockReturnValue({ message: 'Invalid body' });

        const response = await request(app)
            .put('/admin/1/update')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid body');
    });

    it('should return 200 and update user successfully', async () => {
        const response = await request(app)
            .put('/admin/1/update')
            .send({ name: 'Updated User' })
            .set('user', JSON.stringify(mockUser));

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
        expect(response.body.updatedUser).toEqual({ id: 1, name: 'Updated User' });
    });

    it('should return 400 if an error occurs', async () => {
        (AdminUpdateUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Update failed'));

        const response = await request(app)
            .put('/admin/1/update')
            .send({ name: 'Updated User' })
            .set('user', JSON.stringify(mockUser));

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Update failed');
    });
});