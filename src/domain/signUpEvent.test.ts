import { isEventSignUpBody } from "./signUpEvent";

describe("isEventSignUpBody", () => {
    it("should return success true and data when input is valid", () => {
        const input = { flag: true };
        const result = isEventSignUpBody(input);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(input);
        expect(result.error).toBeUndefined();
    });

    it("should return success false and error when input is invalid", () => {
        const input = { flag: "not a boolean" };
        const result = isEventSignUpBody(input);
        expect(result.success).toBe(false);
        expect(result.data).toBeUndefined();
        expect(result.error).toBeDefined();
        expect(result.error?.issues[0].message).toBe("must be a bolean");
    });

    it("should return success false and error when input is missing flag", () => {
        const input = {};
        const result = isEventSignUpBody(input);
        expect(result.success).toBe(false);
        expect(result.data).toBeUndefined();
        expect(result.error).toBeDefined();
        expect(result.error?.issues[0].message).toBe("must be a bolean");
    });
});