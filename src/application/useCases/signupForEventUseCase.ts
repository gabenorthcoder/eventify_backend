import { EventRepository } from "../../infrastructure/repository/eventRepository";
import { UserEventRepository } from "../../infrastructure/repository/userEventRespository";
import { User } from "../../infrastructure/repository/entities/user";
import { UserEvent } from "../../infrastructure/repository/entities/userEvent";

export class SignupEventUseCase {
  private eventRepository: EventRepository;
  private userEventRepository: UserEventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
    this.userEventRepository = new UserEventRepository();
  }

  async execute(
    eventId: number,
    user: User,
    flag: boolean
  ): Promise<UserEvent | string> {

    const event = await this.eventRepository.findEventById(eventId);
    if (!event || !event.isActive || new Date(event.date) < new Date()) {
      throw new Error("Event not found, expired, or is no longer active");
    }

    const existingSignup = await this.userEventRepository.findUserEvent(
      user.id,
      eventId
    );


    if (flag === false && existingSignup) {
      await this.userEventRepository.undoUserEvent(existingSignup);
      return `Your event signup has been canceled`;
    }

 
    if (flag === true && !existingSignup) {
      const signUpEvent = await this.userEventRepository.createUserEvent(
        user,
        event
      );


      const { password, ...userWithoutPassword } = signUpEvent.user;

      const signUpEventWithoutPassword = {
        ...signUpEvent,
        user: userWithoutPassword,
      };
      return signUpEventWithoutPassword as UserEvent;
    }


    if (flag === true && existingSignup) {
      throw new Error("User is already signed up for this event");
    }


    if (flag === false && !existingSignup) {
      throw new Error("User is not signed up for this event");
    }

    return "Unexpected error occurred";
  }
}
