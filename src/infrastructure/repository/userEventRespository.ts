import { AppDataSource } from "./dataSource";
import { UserEvent } from "./entities/userEvent";
import { User } from "./entities/user";
import { Event } from "./entities/event";

export class UserEventRepository {
  private userEventRepository = AppDataSource.getRepository(UserEvent);

  async findUserEvent(
    userId: number,
    eventId: number
  ): Promise<UserEvent | null> {
    const userEvent = await this.userEventRepository.findOne({
      where: {
        user: { id: userId },
        event: { id: eventId },
      },
    });

    return userEvent;
  }

  async findAllUserEvents(): Promise<UserEvent[]> {
    const userEvents = await this.userEventRepository.find({
      relations: ["user", "event"],
    });
    return userEvents;
  }
  async findEventsByUserId(userId: number): Promise<UserEvent[]> {
    const userEvents = await this.userEventRepository.find({
      where: { user: { id: userId } },
      relations: ["event"], // Include the event details
    });

    // Extract and return the event details
    return userEvents;
  }

  async createUserEvent(user: User, event: Event): Promise<UserEvent> {
    const userEvent = this.userEventRepository.create({ user, event });
    return await this.userEventRepository.save(userEvent);
  }

  async undoUserEvent(userEvent: UserEvent): Promise<void> {
    await this.userEventRepository.remove(userEvent);
  }
}
