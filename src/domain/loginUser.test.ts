import { isUserLoginBody } from "./loginUser";
import { z } from "zod";

describe("isUserLoginBody", () => {
    it("should return success true for valid input", () => {
        const validInput = {
            email: "test@example.com",
            password: "password123",
            role: 0,
        };

        const result = isUserLoginBody(validInput);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validInput);
    });

    it("should return success false for invalid email", () => {
        const invalidEmailInput = {
            email: "invalid-email",
            password: "password123",
            role: "user",
        };

        const result = isUserLoginBody(invalidEmailInput);
        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(z.ZodError);
    });

    it("should return success false for short password", () => {
        const shortPasswordInput = {
            email: "test@example.com",
            password: "short",
            role: "user",
        };

        const result = isUserLoginBody(shortPasswordInput);
        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(z.ZodError);
    });

    it("should return success false for password with invalid characters", () => {
        const invalidPasswordInput = {
            email: "test@example.com",
            password: "invalid@password",
            role: "user",
        };

        const result = isUserLoginBody(invalidPasswordInput);
        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(z.ZodError);
    });

    it("should return success false for invalid role", () => {
        const invalidRoleInput = {
            email: "test@example.com",
            password: "password123",
            role: "invalidRole",
        };

        const result = isUserLoginBody(invalidRoleInput);
        expect(result.success).toBe(false);
        expect(result.error).toBeInstanceOf(z.ZodError);
    });
});