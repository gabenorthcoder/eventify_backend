import { UpdateEventUseCase } from "./updateEventUseCase";
import { EventRepository } from "../../infrastructure/repository/eventRepository";
import { User } from "../../infrastructure/repository/entities/user";
import { Event } from "../../infrastructure/repository/entities/event";
import { updateEventInput } from "../../domain/updateEvent";
import logger from "../../utils/logger";

jest.mock("../../infrastructure/repository/eventRepository");
jest.mock("../../utils/logger");

describe("UpdateEventUseCase", () => {
    let updateEventUseCase: UpdateEventUseCase;
    let eventRepository: jest.Mocked<EventRepository>;

    beforeEach(() => {
        eventRepository = new EventRepository() as jest.Mocked<EventRepository>;
        updateEventUseCase = new UpdateEventUseCase();
        (updateEventUseCase as any).eventRepository = eventRepository;
    });

    it("should update an event successfully", async () => {
        const eventId = 1;
        const data: updateEventInput = { title: "Updated Event" };
        const loggerUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User
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
        eventRepository.updateEvent.mockResolvedValue(event);

        const result = await updateEventUseCase.execute(eventId, data, loggerUser);

        expect(eventRepository.findEventById).toHaveBeenCalledWith(eventId);
        expect(eventRepository.updateEvent).toHaveBeenCalledWith(expect.objectContaining({
            ...event,
            ...data,
            updatedBy: loggerUser
        }));
        expect(result).toEqual(expect.objectContaining({
            ...event,
            ...data,
            updatedBy: loggerUser
        }));
    });


});