import express, { Request, Response } from "express";
import { isCreateEventBody } from "../../../domain/createEvent";
import { formatZodError } from "../../../utils/requestChecker";
import { CreateEventUseCase } from "../../../application/useCases/createEventUseCase";
import { User } from "../../../infrastructure/repository/entities/user";

const createEvent = express.Router();

createEvent.post("/create", async (req: Request, res: Response) => {
  try {
    const body = req.body as unknown;

    const isValidBody = isCreateEventBody(body);
    if (!isValidBody.success) {
      const formattedError = formatZodError(isValidBody.error!);
      res.status(400).json(formattedError);
      return;
    }


    const validEventData = isValidBody.data!;


    const user = req.user as User | undefined;
    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not authenticated" });
      return;
    }


    const useCase = new CreateEventUseCase();
    const newEvent = await useCase.execute(validEventData, user);
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(500).json({ message: errorMessage });
  }
});

export { createEvent };
