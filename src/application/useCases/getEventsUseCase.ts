import { EventRepository } from "../../infrastructure/repository/eventRepository";
import { Event } from "../../infrastructure/repository/entities/event";
import { User, UserRole } from "../../infrastructure/repository/entities/user";
import { sanitizeEvents, SanitizedEvent } from "../../utils/sanitizeEvents";
import { PaginationParams, PaginatedResult } from "../../infrastructure/repository/eventRepository";

interface PaginatedEvents{
  data: Event[]
  total: number;
  page: number;
  limit: number;
}
export class GetEventsUseCase {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async execute(params?:PaginationParams, loggedUser?: User, ): Promise<SanitizedEvent[]|PaginatedEvents> {

 

    if(loggedUser){
      if (loggedUser.role === UserRole.ADMIN || loggedUser.role === UserRole.STAFF){

        const allEvents = await this.eventRepository.findAllEvents();
        return sanitizeEvents(allEvents);
      }
    }
if(params){
  const paginatedEventsData = await this.eventRepository.findPaginatedEvents(params)
  return paginatedEventsData
}
    const activeEvents = await this.eventRepository.findAllActiveEvents();
    return activeEvents;
  }
}
