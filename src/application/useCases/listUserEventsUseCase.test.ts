import { ListUserEventsUseCase } from "./listUserEventsUseCase";
import { UserEventRepository } from "../../infrastructure/repository/userEventRespository";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import { Event } from "../../infrastructure/repository/entities/event";
import { UserEvent } from "../../infrastructure/repository/entities/userEvent";
import { jest } from '@jest/globals';

jest.mock("../../infrastructure/repository/userEventRespository");

describe("ListUserEventsUseCase", () => {
  let listUserEventsUseCase: ListUserEventsUseCase;
  let mockUserEventRepository: jest.Mocked<UserEventRepository>;

  beforeEach(() => {
    mockUserEventRepository = new UserEventRepository() as jest.Mocked<UserEventRepository>;
    listUserEventsUseCase = new ListUserEventsUseCase();
    (listUserEventsUseCase as any).userEventRepository = mockUserEventRepository;
  });

  it("should return all user events for Admin role", async () => {
    const loggedUser: User = { id: 1, role: UserRole.ADMIN } as User;
    const allUserEvents: UserEvent[] = [{ id: 1, event: {} as Event, user: loggedUser }];

    mockUserEventRepository.findAllUserEvents.mockResolvedValue(allUserEvents);

    const result = await listUserEventsUseCase.execute(loggedUser);

    expect(mockUserEventRepository.findAllUserEvents).toHaveBeenCalled();
    expect(result).toEqual(allUserEvents);
  });

  it("should return all user events for Staff role", async () => {
    const loggedUser: User = { id: 2, role: UserRole.STAFF } as User;
    const allUserEvents: UserEvent[] = [{ id: 2, event: {} as Event, user: loggedUser }];

    mockUserEventRepository.findAllUserEvents.mockResolvedValue(allUserEvents);

    const result = await listUserEventsUseCase.execute(loggedUser);

    expect(mockUserEventRepository.findAllUserEvents).toHaveBeenCalled();
    expect(result).toEqual(allUserEvents);
  });

 
});
