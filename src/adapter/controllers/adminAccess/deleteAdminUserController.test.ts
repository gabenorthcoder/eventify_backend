import request from "supertest";
import express from "express";
import { adminDeleteUser } from "./deleteAdminUserController";
import { AdminDeleteUsersUseCase } from "../../../application/useCases/adminUserDeleteUseCase";
import { User } from "../../../infrastructure/repository/entities/user";

jest.mock("../../../application/useCases/adminUserDeleteUseCase");

const app = express();
app.use(express.json());
app.use("/admin", adminDeleteUser);

describe("DELETE /admin/:id/delete", () => {
    let mockUser: User;

    beforeEach(() => {
        mockUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User
    });

    it("should return 400 if ID is not a positive integer", async () => {
        const response = await request(app)
            .delete("/admin/abc/delete")
            .set("user", JSON.stringify(mockUser));

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID. It must be a positive integer greater than 0.");
    });

    it("should return 400 if ID is less than or equal to 0", async () => {
        const response = await request(app)
            .delete("/admin/0/delete")
            .set("user", JSON.stringify(mockUser));

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID. It must be a positive integer greater than 0.");
    });

    it("should return 200 if user is deleted successfully", async () => {
        (AdminDeleteUsersUseCase.prototype.execute as jest.Mock).mockResolvedValueOnce(true);

        const response = await request(app)
            .delete("/admin/1/delete")
            .set("user", JSON.stringify(mockUser));

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User deleted successfully");
    });

    it("should return 400 if an error occurs during deletion", async () => {
        (AdminDeleteUsersUseCase.prototype.execute as jest.Mock).mockRejectedValueOnce(new Error("Deletion error"));

        const response = await request(app)
            .delete("/admin/1/delete")
            .set("user", JSON.stringify(mockUser));

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Deletion error");
    });
});