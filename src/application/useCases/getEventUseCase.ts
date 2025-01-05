import { EventRepository } from "../../infrastructure/repository/eventRepository";
import { Event } from "../../infrastructure/repository/entities/event";


export class GetEventUseCase {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async execute(eventId:number): Promise<Event> {

    return await this.eventRepository.findEventById(eventId)

}
}
