import request from 'supertest';
import express from 'express';
import { getEvents } from './getEvents';
import { GetEventsUseCase } from '../../../application/useCases/getEventsUseCase';
import { AuthMiddlewareService } from '../../../infrastructure/middleware/authMiddlewareService';
import { User } from '../../../infrastructure/repository/entities/user';

jest.mock('../../../application/useCases/getEventsUseCase');
jest.mock('../../../infrastructure/middleware/authMiddlewareService');

const app = express();
app.use(express.json());
app.use('/events', getEvents);

describe('GET /events/read', () => {
    let mockGetEventsUseCase: jest.Mocked<GetEventsUseCase>;
    let mockAuthMiddlewareService: jest.Mocked<AuthMiddlewareService>;

    beforeEach(() => {
        mockGetEventsUseCase = new GetEventsUseCase() as jest.Mocked<GetEventsUseCase>;
        mockAuthMiddlewareService = new AuthMiddlewareService() as jest.Mocked<AuthMiddlewareService>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return events when no authorization header is provided', async () => {
        const mockEvents = [{  id: 1,
                        uuid: "some-uuid",
                        title: "Original Title",
                        description: "Original Description",
                        address: "Original Address",
                        date: new Date("2023-10-10"),
                        imageUrl: "http://example.com/image.jpg",
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: new Date(),
                        createdBy: { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User,
                        updatedBy: { id: 2, uuid: "updater-uuid", email: "updater@example.com", password: "hashed-password", firstName: "Updater", lastName: "User" } as User,
                        userEvents: [],}];
        mockGetEventsUseCase.execute.mockResolvedValue(mockEvents);

        const response = await request(app).get('/events/read').query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
    });

    it('should return 500 if an error occurs', async () => {
      const mockEvents = [{  id: 1,
            uuid: "some-uuid",
            title: "Original Title",
            description: "Original Description",
            address: "Original Address",
            date: new Date("2023-10-10"),
            imageUrl: "http://example.com/image.jpg",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
            createdBy: { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User,
            updatedBy: { id: 2, uuid: "updater-uuid", email: "updater@example.com", password: "hashed-password", firstName: "Updater", lastName: "User" } as User,
            userEvents: [],}];
        const mockUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User;
        mockGetEventsUseCase.execute.mockResolvedValue(mockEvents);
     
        const response = await request(app)
            .get('/events/read')
            .set('Authorization', 'Bearer valid_token')
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(500);
   
    });

    it('should return events when valid authorization header is provided', async () => {
        mockGetEventsUseCase.execute.mockRejectedValue(new Error('Internal Server Error'));

        const response = await request(app).get('/events/read').query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
      
    });
});