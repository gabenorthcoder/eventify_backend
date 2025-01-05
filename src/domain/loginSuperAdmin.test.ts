import { isAdminLoginBody } from "./loginSuperAdmin";

describe("isAdminLoginBody", () => {
    it("should return success true with valid email and password", () => {
        const validInput = {
            email: "test@example.com",
            password: "password123",
        };
        const result = isAdminLoginBody(validInput);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validInput);
    });

    it("should return success false with invalid email", () => {
        const invalidEmailInput = {
            email: "invalid-email",
            password: "password123",
        };
        const result = isAdminLoginBody(invalidEmailInput);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Invalid email or password format.");
    });

    it("should return success false with empty password", () => {
        const emptyPasswordInput = {
            email: "test@example.com",
            password: "",
        };
        const result = isAdminLoginBody(emptyPasswordInput);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Invalid password");
    });

    it("should return success false with missing email", () => {
        const missingEmailInput = {
            password: "password123",
        };
        const result = isAdminLoginBody(missingEmailInput);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Required");
    });

    it("should return success false with missing password", () => {
        const missingPasswordInput = {
            email: "test@example.com",
        };
        const result = isAdminLoginBody(missingPasswordInput);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe("Required");
    });

    it("should return success false with completely invalid input", () => {
        const invalidInput = {
            username: "testuser",
            pass: "password123",
        };
        const result = isAdminLoginBody(invalidInput);
        expect(result.success).toBe(false);
        expect(result.error?.errors.length).toBeGreaterThan(0);
    });
});