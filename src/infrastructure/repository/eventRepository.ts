import { AppDataSource } from "./dataSource";
import { Event } from "./entities/event";
import {MoreThanOrEqual} from "typeorm";


export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
export class EventRepository {
  private eventRepository = AppDataSource.getRepository(Event);

 
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const event = this.eventRepository.create(eventData); 
    return await this.eventRepository.save(event); 
  }

 
  async findEventById(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });
    if (!event) {
      throw new Error(`Event with id ${id} not found this`);
    }
    return event;
  }

  // Find all active events
  async findAllActiveEvents(): Promise<Event[]> {
    const activeEvents = await this.eventRepository.find({
      where: { isActive: true },
      order: { date: "ASC" },
    });
    if (!activeEvents) {
      throw new Error("No active events found");
    }
    return activeEvents;
  }



  async findAllEvents(): Promise<Event[]> {
    const events = await this.eventRepository.find({
      relations: ["createdBy", "updatedBy"],
    });
    if (!events || events.length === 0) {
      throw new Error("No events found");
    }
    return events;
  }



  async updateEvent(eventData: Event): Promise<Event> {
    const checkEvent = this.findEventById(eventData.id); 
    if (!checkEvent) {
      throw new Error(`Event with id ${eventData.id} not found`);
    }
    return await this.eventRepository.save(eventData); 
  }


  async softDeleteEvent(id: number): Promise<void> {
    const checkEvent = this.findEventById(id); 
    if (!checkEvent) {
      throw new Error(`Event with id ${id} not found`);
    }
    await this.eventRepository.update(id, { isActive: false });
  }

  async deleteEvent(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }

  async findPaginatedEvents(
    params: PaginationParams
  ): Promise<PaginatedResult<Event>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = params;


    const skip = (page - 1) * limit;


    const [data, total] = await this.eventRepository.findAndCount({
      where: {
        date: MoreThanOrEqual(new Date()), // ✅ Fetch only future events
      },
      order: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
  
}


