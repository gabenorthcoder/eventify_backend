import { GetEventsUseCase } from './getEventsUseCase';
import { EventRepository } from '../../infrastructure/repository/eventRepository';
import { User, UserRole } from '../../infrastructure/repository/entities/user';
import { sanitizeEvents } from '../../utils/sanitizeEvents';
import { Event } from '../../infrastructure/repository/entities/event';

jest.mock('../../infrastructure/repository/eventRepository');
jest.mock('../../utils/sanitizeEvents');

describe('GetEventsUseCase', () => {
    let getEventsUseCase: GetEventsUseCase;
    let eventRepository: jest.Mocked<EventRepository>;

    beforeEach(() => {
        eventRepository = new EventRepository() as jest.Mocked<EventRepository>;
        getEventsUseCase = new GetEventsUseCase();
        (getEventsUseCase as any).eventRepository = eventRepository;
    });

    it('should return sanitized events for admin or staff users', async () => {
        const mockEvents: Event[] = [{
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
        }] as Event[];
        const sanitizedEvents = [{ id: 1, name: 'Sanitized Event 1' }];
        eventRepository.findAllEvents.mockResolvedValue(mockEvents);
        (sanitizeEvents as jest.Mock).mockReturnValue(sanitizedEvents);

        const user: User = { id: 1, role: UserRole.ADMIN } as User;
        const result = await getEventsUseCase.execute(undefined, user);

        expect(eventRepository.findAllEvents).toHaveBeenCalled();
        expect(sanitizeEvents).toHaveBeenCalledWith(mockEvents);
        expect(result).toEqual(sanitizedEvents);
    });

 

    it('should return active events if no params or user are provided', async () => {
        const activeEvents = [{
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
        }] as Event[];
        eventRepository.findAllActiveEvents.mockResolvedValue(activeEvents);

        const result = await getEventsUseCase.execute();

        expect(eventRepository.findAllActiveEvents).toHaveBeenCalled();
        expect(result).toEqual(activeEvents);
    });

    it('should return active events if user is not admin or staff', async () => {
        const activeEvents = [{
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
        }] as Event[];
        eventRepository.findAllActiveEvents.mockResolvedValue(activeEvents);

        const user: User = { id: 1, role: UserRole.USER } as User;
        const result = await getEventsUseCase.execute(undefined, user);

        expect(eventRepository.findAllActiveEvents).toHaveBeenCalled();
        expect(result).toEqual(activeEvents);
    });
});