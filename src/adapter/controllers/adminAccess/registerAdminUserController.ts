import express, { Request, Response } from "express";

import { RegisterAdminUseCase } from "../../../application/useCases/registerAdminUserCase";

import { isUserRegistrationBody } from "../../../domain/registerUser";
import { formatZodError } from "../../../utils/requestChecker";
import { User } from "../../../infrastructure/repository/entities/user";

const registerAdminUser = express.Router();

registerAdminUser.post("/register", async (req: Request, res: Response) => {
  try {
    const body = req.body as unknown;

    const isValidBody = isUserRegistrationBody(body);

    if (!isValidBody.success) {
      const formattedError = formatZodError(isValidBody.error!);
      res.status(400).json(formattedError);
      return;
    }
    const validUserRegistrationBody = isValidBody.data!;
    const user = req.user as User;
    const useCase = new RegisterAdminUseCase();
    const newUser = await useCase.execute(validUserRegistrationBody, user);

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(400).json({ message: errorMessage });
  }
});

export { registerAdminUser };
