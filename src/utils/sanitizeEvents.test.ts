import { sanitizeEvents, SanitizedEvent } from './sanitizeEvents';

describe('sanitizeEvents', () => {
    it('should return an empty array if no events are provided', () => {
        const result = sanitizeEvents([]);
        expect(result).toEqual([]);
    });

    it('should return sanitized events with createdBy and updatedBy without password', () => {
        const events: SanitizedEvent[] = [
            {
                id: 1,
                uuid: 'uuid1',
                title: 'Event 1',
                description: 'Description 1',
                address: 'Address 1',
                imageUrl: 'http://image.url/1',
                date: new Date(),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                createdBy: {
                    id: 1,
                    uuid: 'user-uuid1',
                    email: 'user1@example.com',
                    firstName: 'User',
                    lastName: 'One',
                    role: 1,
                    authType: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
                updatedBy: {
                    id: 2,
                    uuid: 'user-uuid2',
                    email: 'user2@example.com',
                    firstName: 'User',
                    lastName: 'Two',
                    role: 2,
                    authType: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            },
        ];

        const result = sanitizeEvents(events);
        expect(result).toEqual([
            {
                ...events[0],
                createdBy: {
                    ...events[0].createdBy,
                    password: undefined,
                },
                updatedBy: {
                    ...events[0].updatedBy,
                    password: undefined,
                },
            },
        ]);
    });

    it('should handle events with null createdBy and updatedBy', () => {
        const events: SanitizedEvent[] = [
            {
                id: 1,
                uuid: 'uuid1',
                title: 'Event 1',
                description: 'Description 1',
                address: 'Address 1',
                imageUrl: 'http://image.url/1',
                date: new Date(),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                createdBy: null,
                updatedBy: null,
            },
        ];

        const result = sanitizeEvents(events);
        expect(result).toEqual(events);
    });
});