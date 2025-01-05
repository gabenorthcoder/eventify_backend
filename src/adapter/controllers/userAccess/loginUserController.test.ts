import request from 'supertest';
import express from 'express';
import { loginUser } from './loginUserController';
import { isUserLoginBody } from '../../../domain/loginUser';
import { LoginUserUseCase } from '../../../application/useCases/loginUserUseCase';
import { formatZodError } from '../../../utils/requestChecker';

jest.mock('../../../domain/loginUser');
jest.mock('../../../application/useCases/loginUserUseCase');
jest.mock('../../../utils/requestChecker');

const app = express();
app.use(express.json());
app.use('/user', loginUser);

describe('POST /user/login', () => {
    it('should return 400 if request body is invalid', async () => {
        (isUserLoginBody as jest.Mock).mockReturnValue({ success: false, error: 'Invalid body' });
        (formatZodError as jest.Mock).mockReturnValue({ message: 'Invalid body' });

        const response = await request(app)
            .post('/user/login')
            .send({ invalid: 'body' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Invalid body' });
    });

    it('should return 200 and logged user if login is successful', async () => {
        const validBody = { username: 'testuser', password: 'password' };
        const loggedUser = { id: 1, username: 'testuser' };

        (isUserLoginBody as jest.Mock).mockReturnValue({ success: true, data: validBody });
        (LoginUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(loggedUser);

        const response = await request(app)
            .post('/user/login')
            .send(validBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Login successful', loggedUser });
    });

    it('should return 401 if an error occurs during login', async () => {
        const validBody = { username: 'testuser', password: 'password' };

        (isUserLoginBody as jest.Mock).mockReturnValue({ success: true, data: validBody });
        (LoginUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error('Login failed'));

        const response = await request(app)
            .post('/user/login')
            .send(validBody);

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Login failed' });
    });
});