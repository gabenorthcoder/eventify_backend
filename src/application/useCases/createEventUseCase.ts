import { EventRepository } from "../../infrastructure/repository/eventRepository";
import { Event } from "../../infrastructure/repository/entities/event";
import { CreateEventInput } from "../../domain/createEvent";
import { User, UserRole } from "../../infrastructure/repository/entities/user";

export class CreateEventUseCase {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async execute(eventData: CreateEventInput, user: User): Promise<Event> {

    const newEvent = await this.eventRepository.createEvent({
      ...eventData,
      date: new Date(eventData.date), 
      createdBy: user, 
      isActive: true,
    });

    return newEvent; 
  }
}
