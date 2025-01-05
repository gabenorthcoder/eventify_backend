import { Request, Response, NextFunction } from "express";
import { authorizeSuperAdminRole, SuperUser } from "./authorizeSuperAdminUser";

describe("authorizeSuperAdminRole middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            user: {
                firstName: "John",
                role: "superadmin",
            } as SuperUser,
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should call next if user has the correct role", () => {
        const middleware = authorizeSuperAdminRole("superadmin");

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

  
});