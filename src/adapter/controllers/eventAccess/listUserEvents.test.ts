import request from "supertest";
import express from "express";
import { listUserEvents } from "./listUserEvents";
import { ListUserEventsUseCase } from "../../../application/useCases/listUserEventsUseCase";
import { User } from "../../../infrastructure/repository/entities/user";

jest.mock("../../../application/useCases/listUserEventsUseCase");

const app = express();
app.use(express.json());
app.use("/events", listUserEvents);

describe("GET /events/:id?/list", () => {
    let mockExecute: jest.Mock;

    beforeEach(() => {
        mockExecute = jest.fn();
        (ListUserEventsUseCase as jest.Mock).mockImplementation(() => {
            return { execute: mockExecute };
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200 and list of events when user is authenticated", async () => {
        const mockUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User
        const mockEvents = [{ id: "event1", name: "Event 1" }];
        mockExecute.mockResolvedValue(mockEvents);

        const response = await request(app)
            .get("/events/1/list")
            .set("user", JSON.stringify(mockUser));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvents);

    });

    it("should return 401 and error message when an error occurs", async () => {
        const mockUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User
        const mockError = new Error("Something went wrong");
        mockExecute.mockRejectedValue(mockError);

        const response = await request(app)
            .get("/events/1/list")
            .set("user", JSON.stringify(mockUser));

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: mockError.message });

    });
});