import request from "supertest";
import express from "express";
import { updateAsSuperAdminUser } from "./updateSuperAdminUserController";
import { SuperAdminUpdateUserUseCase } from "../../../application/useCases/superAdminUpdateUserUseCase";
import { isUpdateUserBody } from "../../../domain/updateUser";
import { formatZodError } from "../../../utils/requestChecker";
import { SuperUser } from "../middleware/authorizeSuperAdminUser";

jest.mock("../../../application/useCases/superAdminUpdateUserUseCase");
jest.mock("../../../domain/updateUser");
jest.mock("../../../utils/requestChecker");

const app = express();
app.use(express.json());
app.use("/super-admin", updateAsSuperAdminUser);

describe("updateSuperAdminUserController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if ID is invalid", async () => {
        const response = await request(app)
            .put("/super-admin/invalid/update")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Invalid ID. It must be a positive integer greater than 0."
        );
    });

    it("should return 400 if request body is invalid", async () => {
        (isUpdateUserBody as jest.Mock).mockReturnValue({
            success: false,
            error: { issues: [] },
        });
        (formatZodError as jest.Mock).mockReturnValue({ message: "Invalid body" });

        const response = await request(app)
            .put("/super-admin/1/update")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Invalid body" });
    });


 
});