import { SignupEventUseCase } from './signupForEventUseCase';
import { EventRepository } from '../../infrastructure/repository/eventRepository';
import { UserEventRepository } from '../../infrastructure/repository/userEventRespository';
import { User } from '../../infrastructure/repository/entities/user';
import { UserEvent } from '../../infrastructure/repository/entities/userEvent';

jest.mock('../../infrastructure/repository/eventRepository');
jest.mock('../../infrastructure/repository/userEventRespository');

describe('SignupEventUseCase', () => {
    let signupEventUseCase: SignupEventUseCase;
    let eventRepository: jest.Mocked<EventRepository>;
    let userEventRepository: jest.Mocked<UserEventRepository>;

    beforeEach(() => {
        eventRepository = new EventRepository() as jest.Mocked<EventRepository>;
        userEventRepository = new UserEventRepository() as jest.Mocked<UserEventRepository>;
        signupEventUseCase = new SignupEventUseCase();
    });

    const mockUser: User = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User;
    const mockEvent = {
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
    }
    const mockUserEvent: UserEvent = { id: 1, user: mockUser, event: mockEvent };




  

    it('should throw an error if user is already signed up for the event and flag is true', async () => {
        eventRepository.findEventById.mockResolvedValue(mockEvent);
        userEventRepository.findUserEvent.mockResolvedValue(mockUserEvent);

        await expect(signupEventUseCase.execute(1, mockUser, true)).rejects.toThrow('Event not found, expired, or is no longer active');
    });

    it('should throw an error if user is not signed up for the event and flag is false', async () => {
        eventRepository.findEventById.mockResolvedValue(mockEvent);
        userEventRepository.findUserEvent.mockResolvedValue(null);

        await expect(signupEventUseCase.execute(1, mockUser, false)).rejects.toThrow('Event not found, expired, or is no longer active');
    });
});