import express, { Request, Response } from "express";
import { isAdminLoginBody } from "../../../domain/loginSuperAdmin";
import { SuperLoginAdminUseCase } from "../../../application/useCases/loginSuperAdminUseCase";
import { formatZodError } from "../../../utils/requestChecker";

const superAdminUser = express.Router();

superAdminUser.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body as unknown;
    const isValidBody = isAdminLoginBody(body);
    if (!isValidBody.success) {
      const formattedError = formatZodError(isValidBody.error!);
      res.status(400).json(formattedError);
      return;
    }

    const validAdminLoginBody = isValidBody.data!;
    const useCase = new SuperLoginAdminUseCase();
    const loggedSuperAdmin = await useCase.execute(validAdminLoginBody);

    res.status(200).json({ message: "Login successful", loggedSuperAdmin });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(401).json({ message: errorMessage });
  }
});

export { superAdminUser };
