import express, { Request, Response } from "express";
import { SuperAdminListUsersUseCase } from "../../../application/useCases/superAdminListUsersUseCase";

const listAllUsersAsSuperAdmin = express.Router();

listAllUsersAsSuperAdmin.get(
  "/:role?/list",
  async (req: Request, res: Response) => {
    try {
      const userRole = req.params.role;
      const useCase = new SuperAdminListUsersUseCase();
      if (userRole) {
        const numericId = Number(userRole);
        if (!Number.isInteger(numericId) || numericId < 0) {
          res.status(400).json({
            message:
              "Invalid Role. It must be a positive integer greater than 0.",
          });
          return;
        }

        const user = await useCase.execute(numericId);
        res.status(200).json(user);
        return;
      }
      const users = await useCase.execute();
      res.status(200).json(users);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      res.status(401).json({ message: errorMessage });
    }
  }
);

export { listAllUsersAsSuperAdmin };
