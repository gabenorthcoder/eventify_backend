import express, { Request, Response } from "express";
import { formatZodError } from "../../../utils/requestChecker";
import { isUpdateUserBody } from "../../../domain/updateUser";
import { User } from "../../../infrastructure/repository/entities/user";
import { AdminUpdateUserUseCase } from "../../../application/useCases/adminUserUpdateUseCase";

const updateAdminUser = express.Router();

updateAdminUser.put("/:id/update", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);


    if (!Number.isInteger(numericId) || numericId <= 0) {
      res.status(400).json({
        message: "Invalid ID. It must be a positive integer greater than 0.",
      });
      return;
    }

    const body = req.body as unknown;
    const isValidBody = isUpdateUserBody(body);
    if (!isValidBody.success) {
      const formattedError = formatZodError(isValidBody.error!);
      res.status(400).json(formattedError);
      return;
    }
    const validUserData = isValidBody.data!;
    const user = req.user as User;
    const useCase = new AdminUpdateUserUseCase();
    const updatedUser = await useCase.execute(numericId, validUserData, user);
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(400).json({ message: errorMessage });
  }
});

export { updateAdminUser };
