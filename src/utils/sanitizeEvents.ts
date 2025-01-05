interface User {
  id: number;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string|null;
  role: number;
  authType: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface SanitizedEvent {
  id: number;
  uuid: string;
  title: string;
  description: string;
  address: string;
  imageUrl:string;
  date: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: User | null;
  updatedBy: User | null;
}


export function sanitizeEvents(events: SanitizedEvent[]): SanitizedEvent[] {
  if (!events || events.length === 0) return []; 

  return events.map((event) => ({
    ...event,
    createdBy: event.createdBy
      ? { ...event.createdBy, password: undefined }
      : null,
    updatedBy: event.updatedBy
      ? { ...event.updatedBy, password: undefined }
      : null,
  }));
}
