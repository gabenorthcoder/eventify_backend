import { isUserRegistrationBody } from "./registerUser";
import { UserRole } from "../infrastructure/repository/entities/user";

describe("User Registration Validation", () => {
    it("should validate a correct user registration body", () => {
        const validUser = {
            email: "test@example.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.USER,
        };

        const result = isUserRegistrationBody(validUser);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validUser);
    });

    it("should invalidate a user registration body with an invalid email", () => {
        const invalidUser = {
            email: "invalid-email",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.USER,
        };

        const result = isUserRegistrationBody(invalidUser);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Invalid email");
    });

    it("should invalidate a user registration body with a short password", () => {
        const invalidUser = {
            email: "test@example.com",
            password: "short",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.USER,
        };

        const result = isUserRegistrationBody(invalidUser);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Password must be at least 6 characters long");
    });

    it("should invalidate a user registration body with a non-alphanumeric password", () => {
        const invalidUser = {
            email: "test@example.com",
            password: "pass@word",
            firstName: "John",
            lastName: "Doe",
            role: UserRole.USER,
        };

        const result = isUserRegistrationBody(invalidUser);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Password must be alphanumeric");
    });

    it("should invalidate a user registration body with a missing first name", () => {
        const invalidUser = {
            email: "test@example.com",
            password: "password123",
            firstName: "",
            lastName: "Doe",
            role: UserRole.USER,
        };

        const result = isUserRegistrationBody(invalidUser);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("First name is required");
    });

    it("should invalidate a user registration body with an invalid role", () => {
        const invalidUser = {
            email: "test@example.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            role: 3, // Invalid role
        };

        const result = isUserRegistrationBody(invalidUser);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Value must be either 0 (ADMIN), 1 (STAFF) or 2 (USER)");
    });
});