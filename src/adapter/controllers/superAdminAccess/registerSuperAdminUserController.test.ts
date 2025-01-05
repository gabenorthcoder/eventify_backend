import request from "supertest";
import express from "express";
import { superAdminUserRegistration } from "./registerSuperAdminUserController";
import { SuperAdminRegisterUserUseCase } from "../../../application/useCases/superAdminRegisterUsersUseCase";
import { isUserRegistrationBody } from "../../../domain/registerUser";
import { formatZodError } from "../../../utils/requestChecker";

jest.mock("../../../application/useCases/superAdminRegisterUsersUseCase");
jest.mock("../../../domain/registerUser");
jest.mock("../../../utils/requestChecker");

const app = express();
app.use(express.json());
app.use("/super-admin", superAdminUserRegistration);

describe("POST /super-admin/register", () => {
    it("should return 201 and user data when registration is successful", async () => {
        const mockUser = { id: 1, name: "Test User" };
        (isUserRegistrationBody as jest.Mock).mockReturnValue({ success: true, data: mockUser });
        (SuperAdminRegisterUserUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app)
            .post("/super-admin/register")
            .send(mockUser);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "User created successfully", user: mockUser });
    });

    it("should return 400 and error message when body is invalid", async () => {
        const mockError = { message: "Invalid body" };
        (isUserRegistrationBody as jest.Mock).mockReturnValue({ success: false, error: mockError });
        (formatZodError as jest.Mock).mockReturnValue(mockError);

        const response = await request(app)
            .post("/super-admin/register")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual(mockError);
    });

    it("should return 400 and error message when an exception occurs", async () => {
        const mockUser = { id: 1, name: "Test User" };
        const mockError = new Error("Something went wrong");
        (isUserRegistrationBody as jest.Mock).mockReturnValue({ success: true, data: mockUser });
        (SuperAdminRegisterUserUseCase.prototype.execute as jest.Mock).mockRejectedValue(mockError);

        const response = await request(app)
            .post("/super-admin/register")
            .send(mockUser);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: mockError.message });
    });
});