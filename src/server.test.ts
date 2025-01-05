import request from "supertest";
import { app } from "./app";
import { AppDataSource } from "./infrastructure/repository/dataSource";
import logger from "./utils/logger";
import { startServer } from "./server";

jest.mock("./infrastructure/repository/dataSource");
jest.mock("./utils/logger");
jest.mock("./app");

describe("Server", () => {
    beforeAll(() => {
        (app.listen as jest.Mock).mockImplementation((port, callback) => {
            callback();
        });
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

 

    it("should log an error and exit the process if database connection fails", async () => {
        const error = new Error("Database connection failed");
        (AppDataSource.initialize as jest.Mock).mockRejectedValueOnce(error);
        const exitSpy = jest.spyOn(process, "exit").mockImplementation((code?: string | number | null | undefined) => {
            throw new Error(`process.exit: ${code}`);
        });

        await expect(startServer()).rejects.toThrow("process.exit: 1");

        expect(AppDataSource.initialize).toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith("Error connecting to the database", error);
        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});