import { AppDataSource } from "./dataSource";
import { UserEventRepository } from "./userEventRespository";
import { UserEvent } from "./entities/userEvent";
import { User } from "./entities/user";
import { Event } from "./entities/event";
import { Repository } from "typeorm";
import { mock } from "jest-mock-extended";

jest.mock("./dataSource");

describe("UserEventRepository", () => {
    let userEventRepository: UserEventRepository;
    let mockUserEventRepo: Repository<UserEvent>;

    beforeAll(() => {
        mockUserEventRepo = mock<Repository<UserEvent>>();
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserEventRepo);
        userEventRepository = new UserEventRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should find a user event by userId and eventId", async () => {
        const userEvent = new UserEvent();
        (mockUserEventRepo.findOne as jest.Mock).mockResolvedValue(userEvent);

        const result = await userEventRepository.findUserEvent(1, 1);

        expect(mockUserEventRepo.findOne).toHaveBeenCalledWith({
            where: {
                user: { id: 1 },
                event: { id: 1 },
            },
        });
        expect(result).toBe(userEvent);
    });

    it("should return null if user event is not found", async () => {
        (mockUserEventRepo.findOne as jest.Mock).mockResolvedValue(null);

        const result = await userEventRepository.findUserEvent(1, 1);

        expect(result).toBeNull();
    });

    it("should find all user events", async () => {
        const userEvents = [new UserEvent()];
        (mockUserEventRepo.find as jest.Mock).mockResolvedValue(userEvents);

        const result = await userEventRepository.findAllUserEvents();

        expect(mockUserEventRepo.find).toHaveBeenCalledWith({
            relations: ["user", "event"],
        });
        expect(result).toBe(userEvents);
    });

    it("should find events by userId", async () => {
        const userEvents = [new UserEvent()];
        (mockUserEventRepo.find as jest.Mock).mockResolvedValue(userEvents);

        const result = await userEventRepository.findEventsByUserId(1);

        expect(mockUserEventRepo.find).toHaveBeenCalledWith({
            where: { user: { id: 1 } },
            relations: ["event"],
        });
        expect(result).toBe(userEvents);
    });

    it("should create a user event", async () => {
        const user = new User();
        const event = new Event();
        const userEvent = new UserEvent();
        (mockUserEventRepo.create as jest.Mock).mockReturnValue(Promise.resolve(userEvent));
        (mockUserEventRepo.save as jest.Mock).mockResolvedValue(Promise.resolve(userEvent));

        const result = await userEventRepository.createUserEvent(user, event);

        expect(mockUserEventRepo.create).toHaveBeenCalledWith({ user, event });
        expect(result).toBe(userEvent);
    });

    it("should undo a user event", async () => {
        const userEvent = new UserEvent();
        (mockUserEventRepo.remove as jest.Mock).mockResolvedValue(Promise.resolve(userEvent));

        await userEventRepository.undoUserEvent(userEvent);

        expect(mockUserEventRepo.remove).toHaveBeenCalledWith(userEvent);
    });
});