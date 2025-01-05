import express, { Request, Response } from "express";
import { isUserLoginBody } from "../../../domain/loginUser";
import { LoginUserUseCase } from "../../../application/useCases/loginUserUseCase";
import { formatZodError } from "../../../utils/requestChecker";

const loginUser = express.Router();


loginUser.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body as unknown;
    const isValidBody = isUserLoginBody(body);
    if (!isValidBody.success) {
      const formattedError = formatZodError(isValidBody.error!);
      res.status(400).json(formattedError);
      return;
    }

    const validUserLoginBody = isValidBody.data!;
    const useCase = new LoginUserUseCase();
    const loggedUser = await useCase.execute(validUserLoginBody);

    res.status(200).json({ message: "Login successful", loggedUser });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(401).json({ message: errorMessage });
  }
});

export { loginUser };
