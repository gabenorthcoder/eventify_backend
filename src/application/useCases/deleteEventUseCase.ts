import { EventRepository } from "../../infrastructure/repository/eventRepository";
import logger from "../../utils/logger";

export class DeleteEventUseCase {
  private eventRepository: EventRepository;
  constructor() {
    this.eventRepository = new EventRepository();
  }
  async execute(eventId: number): Promise<void> {

    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      logger.warn(`Event Deletion: Event with id ${eventId} not found`);
      throw new Error("Event not found");
    }


    await this.eventRepository.deleteEvent(eventId);
  }
}
