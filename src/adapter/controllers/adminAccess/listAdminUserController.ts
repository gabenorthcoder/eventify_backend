import express, { Request, Response } from "express";
import { AdminListUsersUseCase } from "../../../application/useCases/listAdminUsersUseCase";
import { User } from "../../../infrastructure/repository/entities/user";

const listAdminUsers = express.Router();

listAdminUsers.get("/:role?/list", async (req: Request, res: Response) => {
  try {
  

    const userRole = req.params.role; 
 
    const loggedUser = req.user as User;

    const useCase = new AdminListUsersUseCase();


    if (typeof userRole !== "undefined") {
      const numericId = Number(userRole);
      if (!Number.isInteger(numericId) || numericId < 0) {
        res.status(400).json({
          message:
            "Invalid Role. It must be a positive integer greater than 0.",
        });
        return;
      }
      const users = await useCase.execute(loggedUser, numericId);
      res.status(200).json(users);
    } else {
    
      const users = await useCase.execute(loggedUser);
      res.status(200).json(users);
    }
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(401).json({ message: errorMessage });
  }
});


export { listAdminUsers };
