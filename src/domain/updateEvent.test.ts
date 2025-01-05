import { isUpdateEventBody } from "./updateEvent";

describe("isUpdateEventBody", () => {
    it("should validate a correct event update body", () => {
        const validBody = {
            title: "Event Title",
            description: "Event Description",
            address: "123 Event St.",
            date: "2023-10-10",
            isActive: true,
        };

        const result = isUpdateEventBody(validBody);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validBody);
    });

    it("should fail validation if title is empty", () => {
        const invalidBody = {
            title: "",
            description: "Event Description",
            address: "123 Event St.",
            date: "2023-10-10",
            isActive: true,
        };

        const result = isUpdateEventBody(invalidBody);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe("Title is required");
    });

    it("should fail validation if description is empty", () => {
        const invalidBody = {
            title: "Event Title",
            description: "",
            address: "123 Event St.",
            date: "2023-10-10",
            isActive: true,
        };

        const result = isUpdateEventBody(invalidBody);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe("Description is required");
    });

    it("should fail validation if date is invalid", () => {
        const invalidBody = {
            title: "Event Title",
            description: "Event Description",
            address: "123 Event St.",
            date: "invalid-date",
            isActive: true,
        };

        const result = isUpdateEventBody(invalidBody);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe("Invalid date format");
    });

    it("should validate a body with only optional fields", () => {
        const validBody = {
            title: "Event Title",
        };

        const result = isUpdateEventBody(validBody);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validBody);
    });

    it("should fail validation if address is not a string", () => {
        const invalidBody = {
            title: "Event Title",
            description: "Event Description",
            address: 123,
            date: "2023-10-10",
            isActive: true,
        };

        const result = isUpdateEventBody(invalidBody);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe("Address is required");
    });
});