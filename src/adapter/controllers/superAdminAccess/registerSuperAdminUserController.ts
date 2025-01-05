import express, { Request, Response } from "express";
import { SuperAdminRegisterUserUseCase } from "../../../application/useCases/superAdminRegisterUsersUseCase";
import { isUserRegistrationBody } from "../../../domain/registerUser";
import { formatZodError } from "../../../utils/requestChecker";

const superAdminUserRegistration = express.Router();

superAdminUserRegistration.post(
  "/register",
  async (req: Request, res: Response) => {
    try {
      const body = req.body as unknown;
      const isValidBody = isUserRegistrationBody(body);
      if (!isValidBody.success) {
        const formattedError = formatZodError(isValidBody.error!);
        res.status(400).json(formattedError);
        return;
      }
      const validUserRegistrationBody = isValidBody.data!;
      const useCase = new SuperAdminRegisterUserUseCase();
      const newUser = await useCase.execute(validUserRegistrationBody);

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      res.status(400).json({ message: errorMessage });
    }
  }
);

export { superAdminUserRegistration };
