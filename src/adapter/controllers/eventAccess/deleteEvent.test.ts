import request from "supertest";
import express from "express";
import { deleteEvent } from "./deleteEvent";
import { DeleteEventUseCase } from "../../../application/useCases/deleteEventUseCase";

jest.mock("../../../application/useCases/deleteEventUseCase");

const app = express();
app.use(express.json());
app.use("/events", deleteEvent);

describe("DELETE /events/:id/delete", () => {

    it("should return 400 if the ID is less than or equal to 0", async () => {
        const response = await request(app).delete("/events/0/delete");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID. It must be a positive integer greater than 0.");
    });

    it("should return 200 and delete the event successfully", async () => {
        (DeleteEventUseCase.prototype.execute as jest.Mock).mockResolvedValueOnce(undefined);

        const response = await request(app).delete("/events/1/delete");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Event deleted successfully");
    });

    it("should return 400 if there is an error during deletion", async () => {
        (DeleteEventUseCase.prototype.execute as jest.Mock).mockRejectedValueOnce(new Error("Deletion error"));

        const response = await request(app).delete("/events/1/delete");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Deletion error");
    });
});