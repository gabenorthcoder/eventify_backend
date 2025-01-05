import { ZodError, ZodIssue } from "zod";
import { formatZodError } from "./requestChecker";

describe("formatZodError", () => {
    it("should format ZodError correctly with expected and received values", () => {
        const error = new ZodError([
            {
                path: ["field"],
                message: "Invalid input",
                received: "string",
                expected: "number",
            } as ZodIssue & { received: unknown; expected: unknown },
        ]);

        const result = formatZodError(error);

        expect(result).toEqual([
            {
                path: "field",
                message: "Expected number, but received string",
                expected: "number",
                received: "string",
            },
        ]);
    });

    it("should format ZodError correctly with only expected value", () => {
        const error = new ZodError([
            {
                path: ["field"],
                message: "Invalid input",
                expected: "number",
            } as ZodIssue & { expected: unknown },
        ]);

        const result = formatZodError(error);

        expect(result).toEqual([
            {
                path: "field",
                message: "Expected number",
                expected: "number",
                received: undefined,
            },
        ]);
    });

    it("should format ZodError correctly with only received value", () => {
        const error = new ZodError([
            {
                path: ["field"],
                message: "Invalid input",
                received: "string",
            } as ZodIssue & { received: unknown },
        ]);

        const result = formatZodError(error);

        expect(result).toEqual([
            {
                path: "field",
                message: "Received string",
                expected: undefined,
                received: "string",
            },
        ]);
    });

    it("should format ZodError correctly with neither expected nor received values", () => {
        const error = new ZodError([
            {
                path: ["field"],
                message: "Invalid input",
            } as ZodIssue,
        ]);

        const result = formatZodError(error);

        expect(result).toEqual([
            {
                path: "field",
                message: "Invalid input",
                expected: undefined,
                received: undefined,
            },
        ]);
    });
});

