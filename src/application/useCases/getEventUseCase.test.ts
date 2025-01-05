import { GetEventUseCase } from './getEventUseCase';
import { EventRepository } from '../../infrastructure/repository/eventRepository';
import { Event } from '../../infrastructure/repository/entities/event';
import { User } from '../../infrastructure/repository/entities/user';

jest.mock('../../infrastructure/repository/eventRepository');

describe('GetEventUseCase', () => {
    let getEventUseCase: GetEventUseCase;
    let eventRepository: jest.Mocked<EventRepository>;

    beforeEach(() => {
        eventRepository = new EventRepository() as jest.Mocked<EventRepository>;
        getEventUseCase = new GetEventUseCase();
        (getEventUseCase as any).eventRepository = eventRepository;
    });

    it('should return an event when found', async () => {
        const eventId = 1;
        const event: Event = {
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
            };
        eventRepository.findEventById.mockResolvedValue(event);

        const result = await getEventUseCase.execute(eventId);

        expect(result).toEqual(event);
        expect(eventRepository.findEventById).toHaveBeenCalledWith(eventId);
    });

 
});