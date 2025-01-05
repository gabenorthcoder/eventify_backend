import { EventRepository } from "./eventRepository";
import { Event } from "./entities/event";
import { User } from "./entities/user";

describe("EventRepository", () => {
    let eventRepository: EventRepository;

    beforeAll(() => {
        eventRepository = new EventRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("updateEvent", () => {
        it("should update an event successfully", async () => {
            const existingEvent: Event = {
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

            const updatedEventData: Event = {
                ...existingEvent,
                title: "Updated Title",
                description: "Updated Description",
            };

            jest.spyOn(eventRepository, "findEventById").mockResolvedValue(existingEvent);
            jest.spyOn(eventRepository['eventRepository'], 'save').mockResolvedValue(updatedEventData);

            const result = await eventRepository.updateEvent(updatedEventData);

            expect(result).toEqual(updatedEventData);
            expect(eventRepository.findEventById).toHaveBeenCalledWith(existingEvent.id);
            expect(eventRepository['eventRepository'].save).toHaveBeenCalledWith(updatedEventData);
        });

        
    });
});
