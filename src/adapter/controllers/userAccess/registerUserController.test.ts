import request from "supertest";
import express from "express";
import { registerUser } from "./registerUserController";
import { RegisterUserUseCase } from "../../../application/useCases/registerUserUseCase";
import { isUserRegistrationBody } from "../../../domain/registerUser";
import { formatZodError } from "../../../utils/requestChecker";

jest.mock("../../../application/useCases/registerUserUseCase");
jest.mock("../../../domain/registerUser");
jest.mock("../../../utils/requestChecker");

const app = express();
app.use(express.json());
app.use("/api", registerUser);

describe("POST /register", () => {
    it("should return 201 and the new user when registration is successful", async () => {
        const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
        (isUserRegistrationBody as jest.Mock).mockReturnValue({ success: true, data: mockUser });
        (RegisterUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app)
            .post("/api/register")
            .send(mockUser);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "User created successfully", user: mockUser });
    });

    it("should return 400 and validation errors when request body is invalid", async () => {
        const mockError = { issues: [{ message: "Invalid data" }] };
        (isUserRegistrationBody as jest.Mock).mockReturnValue({ success: false, error: mockError });
        (formatZodError as jest.Mock).mockReturnValue(mockError);

        const response = await request(app)
            .post("/api/register")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual(mockError);
    });

    it("should return 400 and an error message when an exception occurs", async () => {
        const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
        (isUserRegistrationBody as jest.Mock).mockReturnValue({ success: true, data: mockUser });
        (RegisterUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(new Error("Something went wrong"));

        const response = await request(app)
            .post("/api/register")
            .send(mockUser);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Something went wrong" });
    });
});