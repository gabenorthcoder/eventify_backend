import { EventRepository } from "../../infrastructure/repository/eventRepository";
import { User } from "../../infrastructure/repository/entities/user";
import { Event } from "../../infrastructure/repository/entities/event";
import { updateEventInput } from "../../domain/updateEvent";
import _ from "lodash";
import logger from "../../utils/logger";

export class UpdateEventUseCase {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async execute(
    eventId: number,
    data: updateEventInput,
    loggerUser: User
  ): Promise<Event> {

    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      logger.warn(`Event Update: Event with id ${eventId} not found`);
      throw new Error("Event not found");
    }

    _.merge(event, data);


    event.updatedBy = loggerUser;

    return await this.eventRepository.updateEvent(event);
  }
}
