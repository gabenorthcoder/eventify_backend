import request from "supertest";
import express from "express";
import { getEvent } from "./getEvent";
import { GetEventUseCase } from "../../../application/useCases/getEventUseCase";

jest.mock("../../../application/useCases/getEventUseCase");

const app = express();
app.use(express.json());
app.use("/", getEvent);

describe("GET /:eventId/event", () => {
    it("should return 400 if eventId is not a positive integer", async () => {
        const response = await request(app).get("/abc/event");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID. It must be a positive integer greater than 0.");
    });

    it("should return 400 if eventId is less than or equal to 0", async () => {
        const response = await request(app).get("/-1/event");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID. It must be a positive integer greater than 0.");
    });

    it("should return 200 and the event data if eventId is valid", async () => {
        const mockEvent = { id: 1, name: "Test Event" };
        (GetEventUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockEvent);

        const response = await request(app).get("/1/event");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEvent);
    });

    it("should return 500 if there is an internal server error", async () => {
        (GetEventUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));

        const response = await request(app).get("/1/event");
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal Server Error");
    });


});