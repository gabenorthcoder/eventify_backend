import { Request, Response, NextFunction } from "express";
import { authorizeRole } from "./authorizeUser";
import { User, UserRole } from "../../../infrastructure/repository/entities/user";

describe("authorizeRole middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should return 401 if user is not present in request", () => {
        const middleware = authorizeRole([UserRole.ADMIN]);

        middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Unauthorized: User information missing",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 if user role is not allowed", () => {
        req.user = { role: UserRole.USER } as User;
        const middleware = authorizeRole([UserRole.ADMIN]);

        middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Forbidden: You do not have access to this resource",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if user role is allowed", () => {
        req.user = { role: UserRole.ADMIN } as User;
        const middleware = authorizeRole([UserRole.ADMIN]);

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});