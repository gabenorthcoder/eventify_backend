import { CreateEventUseCase } from './createEventUseCase';
import { EventRepository } from '../../infrastructure/repository/eventRepository';
import { CreateEventInput } from '../../domain/createEvent';
import { User, UserRole } from '../../infrastructure/repository/entities/user';
import { Event } from '../../infrastructure/repository/entities/event';

jest.mock('../../infrastructure/repository/eventRepository');

describe('CreateEventUseCase', () => {
    let createEventUseCase: CreateEventUseCase;
    let eventRepository: jest.Mocked<EventRepository>;

    beforeEach(() => {
        eventRepository = new EventRepository() as jest.Mocked<EventRepository>;
        createEventUseCase = new CreateEventUseCase();
        (createEventUseCase as any).eventRepository = eventRepository;
    });

    it('should create a new event', async () => {
        const eventData: CreateEventInput = {
            title: 'Test Event',
            description: 'This is a test event',
            date: '2023-10-10T00:00:00Z',
            imageUrl: 'http://example.com/image.jpg',
            address: '123 Test Street',
        };

        const user = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User

        const createdEvent: Event = {
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

        eventRepository.createEvent.mockResolvedValue(createdEvent);

        const result = await createEventUseCase.execute(eventData, user);

        expect(result).toEqual(createdEvent);
        expect(eventRepository.createEvent).toHaveBeenCalledWith({
            ...eventData,
            date: new Date(eventData.date),
            createdBy: user,
            isActive: true,
        });
    });

    it('should throw an error if event creation fails', async () => {
        const eventData: CreateEventInput = {
            title: 'Test Event',
            description: 'This is a test event',
            date: '2023-10-10T00:00:00Z',
            imageUrl: 'http://example.com/image.jpg',
            address: '123 Test Street',
        };

        const user = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User

        eventRepository.createEvent.mockRejectedValue(new Error('Event creation failed'));

        await expect(createEventUseCase.execute(eventData, user)).rejects.toThrow('Event creation failed');
    });
});