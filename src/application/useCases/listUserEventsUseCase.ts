import { UserEventRepository } from "../../infrastructure/repository/userEventRespository";
import { UserRepository } from "../../infrastructure/repository/userRepository";
import { Event } from "../../infrastructure/repository/entities/event";
import { UserEvent } from "../../infrastructure/repository/entities/userEvent";
import { User, UserRole } from "../../infrastructure/repository/entities/user";

export class ListUserEventsUseCase {
  private userRepository: UserRepository;
  private userEventRepository: UserEventRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.userEventRepository = new UserEventRepository();
  }

  async execute(
    loggedUser: User,
  ): Promise<Event[] | UserEvent[]> {

    if (
      loggedUser.role === UserRole.ADMIN ||
      loggedUser.role === UserRole.STAFF
    ) {
      const allUserEvents = await this.userEventRepository.findAllUserEvents();
      return allUserEvents;
    }

 
    const events = await this.userEventRepository.findEventsByUserId(loggedUser.id);
    return events;
  }
}
