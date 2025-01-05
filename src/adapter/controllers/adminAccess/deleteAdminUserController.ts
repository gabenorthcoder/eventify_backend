import express, { Request, Response } from "express";
import { AdminDeleteUsersUseCase } from "../../../application/useCases/adminUserDeleteUseCase";
import { User } from "../../../infrastructure/repository/entities/user";

const adminDeleteUser = express.Router();

adminDeleteUser.delete("/:id/delete", async (req: Request, res: Response) => {
  try {
    const loggedUser = req.user as User;
    const { id } = req.params;
    const numericId = Number(id);

 
    if (!Number.isInteger(numericId) || numericId <= 0) {
      res.status(400).json({
        message: "Invalid ID. It must be a positive integer greater than 0.",
      });
      return;
    }

    const useCase = new AdminDeleteUsersUseCase();
    await useCase.execute(numericId, loggedUser);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
   
    res.status(400).json({ message: errorMessage });
  }
});

export { adminDeleteUser };
