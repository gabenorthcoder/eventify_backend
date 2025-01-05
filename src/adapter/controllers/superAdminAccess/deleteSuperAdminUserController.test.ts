import request from 'supertest';
import express from 'express';
import { superAdminDeleteUser } from './deleteSuperAdminUserController';
import { SuperAdminDeleteUsersUseCase } from '../../../application/useCases/superAdminDeleteUsersUseCase';

jest.mock('../../../application/useCases/superAdminDeleteUsersUseCase');

const app = express();
app.use(express.json());
app.use('/super-admin', superAdminDeleteUser);

describe('DELETE /super-admin/:id/delete', () => {
    it('should return 400 if id is not a positive integer', async () => {
        const response = await request(app).delete('/super-admin/abc/delete');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid ID. It must be a positive integer greater than 0.');
    });

    it('should return 400 if id is less than or equal to 0', async () => {
        const response = await request(app).delete('/super-admin/0/delete');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid ID. It must be a positive integer greater than 0.');
    });

    it('should return 200 and delete the user successfully', async () => {
        (SuperAdminDeleteUsersUseCase.prototype.execute as jest.Mock).mockResolvedValueOnce(undefined);

        const response = await request(app).delete('/super-admin/1/delete');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });

    it('should return 400 if an error occurs during deletion', async () => {
        (SuperAdminDeleteUsersUseCase.prototype.execute as jest.Mock).mockRejectedValueOnce(new Error('Deletion error'));

        const response = await request(app).delete('/super-admin/1/delete');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Deletion error');
    });
});