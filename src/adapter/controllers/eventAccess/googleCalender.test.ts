import request from 'supertest';
import express from 'express';
import { googleCalenderAuth, googleCalenderCallBack } from './googleCalender';
import { getAuthURL, getTokens, addEventToGoogleCalendar } from '../../../infrastructure/googleCalender';
import { EventRepository } from '../../../infrastructure/repository/eventRepository';

jest.mock('../../../infrastructure/googleCalender');
jest.mock('../../../infrastructure/repository/eventRepository');

const app = express();
app.use(express.json());
app.use(googleCalenderAuth);
app.use(googleCalenderCallBack);

describe('Google Calendar Auth Routes', () => {
    describe('GET /auth/google/calender', () => {
        it('should redirect to Google auth URL', async () => {
            const mockUrl = 'http://mockurl.com';
            (getAuthURL as jest.Mock).mockReturnValue(mockUrl);

            const response = await request(app).get('/auth/google/calender').query({
                redirecturi: 'http://localhost:3000',
                event: '1'
            });

            expect(response.status).toBe(302);
            expect(response.header.location).toBe(mockUrl);
        });
    });

    describe('GET /auth/google/calender/callback', () => {
        it('should handle Google Calendar callback and redirect with event data', async () => {
            const mockTokens = { access_token: 'mockAccessToken' };
            const mockEvent = {
                id: 1,
                title: 'Test Event',
                address: '123 Test St',
                description: 'Test Description',
                date: new Date()
            };
            const mockAddedEvent = { id: 'mockEventId' };

            (getTokens as jest.Mock).mockResolvedValue(mockTokens);
            (EventRepository.prototype.findEventById as jest.Mock).mockResolvedValue(mockEvent);
            (addEventToGoogleCalendar as jest.Mock).mockResolvedValue(mockAddedEvent);

            const state = Buffer.from(JSON.stringify({ event: '1', redirectUri: 'http://localhost:3000' })).toString('base64');

            const response = await request(app).get('/auth/google/calender/callback').query({
                state,
                code: 'mockCode'
            });

            expect(response.status).toBe(302);
            expect(response.header.location).toContain('http://localhost:3000/auth/google/calender/callback?event=');
        });

    });
});