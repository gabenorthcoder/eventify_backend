import { DeleteEventUseCase } from './deleteEventUseCase';
import { EventRepository } from '../../infrastructure/repository/eventRepository';
import logger from '../../utils/logger';
import { Event } from '../../infrastructure/repository/entities/event';
import { User } from '../../infrastructure/repository/entities/user';

jest.mock('../../infrastructure/repository/eventRepository');
jest.mock('../../utils/logger');

describe('DeleteEventUseCase', () => {
    let deleteEventUseCase: DeleteEventUseCase;
    let eventRepositoryMock: jest.Mocked<EventRepository>;

    beforeEach(() => {
        eventRepositoryMock = new EventRepository() as jest.Mocked<EventRepository>;
        deleteEventUseCase = new DeleteEventUseCase();
        deleteEventUseCase['eventRepository'] = eventRepositoryMock;
    });

    it('should delete an event if it exists', async () => {
        const eventId = 1;
        eventRepositoryMock.findEventById.mockResolvedValue({
            id: 1,
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
            userEvents: [],
        });
        eventRepositoryMock.deleteEvent.mockResolvedValue();

        await deleteEventUseCase.execute(eventId);

        expect(eventRepositoryMock.findEventById).toHaveBeenCalledWith(eventId);
        expect(eventRepositoryMock.deleteEvent).toHaveBeenCalledWith(eventId);
    });

  
});