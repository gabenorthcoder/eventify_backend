import request from "supertest";
import express from "express";
import { updateEvent } from "./updateEvents";
import { UpdateEventUseCase } from "../../../application/useCases/updateEventUseCase";
import { isUpdateEventBody } from "../../../domain/updateEvent";
import { formatZodError } from "../../../utils/requestChecker";
import { User } from "../../../infrastructure/repository/entities/user";

jest.mock("../../../application/useCases/updateEventUseCase");
jest.mock("../../../domain/updateEvent");
jest.mock("../../../utils/requestChecker");

const app = express();
app.use(express.json());
app.use("/events", updateEvent);

describe("PUT /events/:id/update", () => {
    let mockUser: User;

    beforeEach(() => {
        mockUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User
        jest.clearAllMocks();
    });

    it("should return 400 if ID is not a positive integer", async () => {
        const response = await request(app)
            .put("/events/abc/update")
            .set("user", JSON.stringify(mockUser))
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Invalid ID. It must be a positive integer greater than 0."
        );
    });

    it("should return 400 if request body is invalid", async () => {
        (isUpdateEventBody as jest.Mock).mockReturnValue({
            success: false,
            error: { issues: [] },
        });
        (formatZodError as jest.Mock).mockReturnValue({ message: "Invalid body" });

        const response = await request(app)
            .put("/events/1/update")
            .set("user", JSON.stringify(mockUser))
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid body");
    });

    it("should return 200 and update the event successfully", async () => {
        const validEventData = { title: "Updated Event" };
        (isUpdateEventBody as jest.Mock).mockReturnValue({
            success: true,
            data: validEventData,
        });
        (UpdateEventUseCase.prototype.execute as jest.Mock).mockResolvedValue(
            validEventData
        );

        const response = await request(app)
            .put("/events/1/update")
            .set("user", JSON.stringify(mockUser))
            .send(validEventData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Event updated successfully");
        expect(response.body.updatedEvent).toEqual(validEventData);
    });

    it("should return 400 if an error occurs during update", async () => {
        const validEventData = { title: "Updated Event" };
        (isUpdateEventBody as jest.Mock).mockReturnValue({
            success: true,
            data: validEventData,
        });
        (UpdateEventUseCase.prototype.execute as jest.Mock).mockRejectedValue(
            new Error("Update failed")
        );

        const response = await request(app)
            .put("/events/1/update")
            .set("user", JSON.stringify(mockUser))
            .send(validEventData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Update failed");
    });
});