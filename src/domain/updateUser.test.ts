import { isUpdateUserBody, UserUpdateInput } from "./updateUser";
import { UserRole } from "../infrastructure/repository/entities/user";

describe("isUpdateUserBody", () => {
    it("should validate a correct user update input", () => {
        const validInput: UserUpdateInput = {
            email: "test@example.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.USER,
        };

        const result = isUpdateUserBody(validInput);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validInput);
    });

    it("should invalidate an incorrect email", () => {
        const invalidInput = {
            email: "invalid-email",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.USER,
        };

        const result = isUpdateUserBody(invalidInput);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Invalid email");
    });

    it("should invalidate a short password", () => {
        const invalidInput = {
            email: "test@example.com",
            password: "short",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.USER,
        };

        const result = isUpdateUserBody(invalidInput);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Password must be at least 6 characters long");
    });

    it("should invalidate a non-alphanumeric password", () => {
        const invalidInput = {
            email: "test@example.com",
            password: "pass@word",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.USER,
        };

        const result = isUpdateUserBody(invalidInput);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Password must be alphanumeric");
    });


    it("should invalidate an incorrect role", () => {
        const invalidInput = {
            email: "test@example.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            role: 3, 
        };

        const result = isUpdateUserBody(invalidInput);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Value must be either 0 (ADMIN), 1 (STAFF) or 2 (USER)");
    });
});