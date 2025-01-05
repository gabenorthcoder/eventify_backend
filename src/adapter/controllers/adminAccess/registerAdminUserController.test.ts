import request from "supertest";
import express from "express";
import { registerAdminUser } from "./registerAdminUserController";
import { RegisterAdminUseCase } from "../../../application/useCases/registerAdminUserCase";
import { isUserRegistrationBody } from "../../../domain/registerUser";
import { formatZodError } from "../../../utils/requestChecker";
import { User } from "../../../infrastructure/repository/entities/user";

jest.mock("../../../application/useCases/registerAdminUserCase");
jest.mock("../../../domain/registerUser");
jest.mock("../../../utils/requestChecker");

const app = express();
app.use(express.json());
app.use("/admin", registerAdminUser);

describe("POST /admin/register", () => {
    let mockUser: User;

    beforeEach(() => {
        mockUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User
    });

    it("should return 201 and create a new user when request body is valid", async () => {
        (isUserRegistrationBody as jest.Mock).mockReturnValue({
            success: true,
            data: { email: "newuser@example.com", password: "password123" },
        });
        (RegisterAdminUseCase.prototype.execute as jest.Mock).mockResolvedValue({
            id: "2",
            email: "newuser@example.com",
        });

        const response = await request(app)
            .post("/admin/register")
            .send({ email: "newuser@example.com", password: "password123" })
            .set("user", JSON.stringify(mockUser));

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "User created successfully",
            user: { id: "2", email: "newuser@example.com" },
        });
    });

    it("should return 400 and error message when request body is invalid", async () => {
        (isUserRegistrationBody as jest.Mock).mockReturnValue({
            success: false,
            error: { issues: [{ message: "Invalid email" }] },
        });
        (formatZodError as jest.Mock).mockReturnValue({ message: "Invalid email" });

        const response = await request(app)
            .post("/admin/register")
            .send({ email: "invalid-email", password: "password123" });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Invalid email" });
    });

    it("should return 400 and error message when an exception occurs", async () => {
        (isUserRegistrationBody as jest.Mock).mockImplementation(() => {
            throw new Error("Unexpected error");
        });

        const response = await request(app)
            .post("/admin/register")
            .send({ email: "newuser@example.com", password: "password123" });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Unexpected error" });
    });
});