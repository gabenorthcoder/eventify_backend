
import { createEvent } from "./createEvent";
import express from "express";
import request from "supertest";
import { isCreateEventBody } from "../../../domain/createEvent";
import { CreateEventUseCase } from "../../../application/useCases/createEventUseCase";
import { User } from "../../../infrastructure/repository/entities/user";

describe("isCreateEventBody", () => {
    it("should validate a correct event body", () => {
        const validEvent = {
            title: "Event Title",
            description: "Event Description",
            address: "123 Event Street",
            date: "2023-10-10",
            imageUrl: "http://example.com/image.jpg",
        };

        const result = isCreateEventBody(validEvent);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validEvent);
    });

    it("should invalidate an event body with missing title", () => {
        const invalidEvent = {
            description: "Event Description",
            address: "123 Event Street",
            date: "2023-10-10",
            imageUrl: "http://example.com/image.jpg",
        };

        const result = isCreateEventBody(invalidEvent);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Required");
    });

    it("should invalidate an event body with invalid date", () => {
        const invalidEvent = {
            title: "Event Title",
            description: "Event Description",
            address: "123 Event Street",
            date: "invalid-date",
            imageUrl: "http://example.com/image.jpg",
        };

        const result = isCreateEventBody(invalidEvent);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Invalid date format");
    });

    it("should invalidate an event body with missing address", () => {
        const invalidEvent = {
            title: "Event Title",
            description: "Event Description",
            date: "2023-10-10",
            imageUrl: "http://example.com/image.jpg",
        };

        const result = isCreateEventBody(invalidEvent);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Address is required");
    });

    it("should invalidate an event body with missing imageUrl", () => {
        const invalidEvent = {
            title: "Event Title",
            description: "Event Description",
            address: "123 Event Street",
            date: "2023-10-10",
        };

        const result = isCreateEventBody(invalidEvent);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Image URL is required");
    });

    jest.mock("../../../application/useCases/createEventUseCase");

    const app = express();
    app.use(express.json());
    app.use("/events", createEvent);

    describe("POST /events/create", () => {
      

        it("should return 400 for invalid event body", async () => {
            const invalidEvent = {
                description: "Event Description",
                address: "123 Event Street",
                date: "2023-10-10",
                imageUrl: "http://example.com/image.jpg",
            };

            const response = await request(app)
                .post("/events/create")
                .send(invalidEvent);

            expect(response.status).toBe(400);
           
        });

        it("should return 401 if user is not authenticated", async () => {
            const validEvent = {
                title: "Event Title",
                description: "Event Description",
                address: "123 Event Street",
                date: "2023-10-10",
                imageUrl: "http://example.com/image.jpg",
            };

            const response = await request(app)
                .post("/events/create")
                .send(validEvent);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Unauthorized: User not authenticated");
        });

       
    });
});