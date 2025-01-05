import express, { Request, Response } from "express";
import { ListUserEventsUseCase } from "../../../application/useCases/listUserEventsUseCase";
import { User } from "../../../infrastructure/repository/entities/user";

const listUserEvents = express.Router();

listUserEvents.get("/:id?/list", async (req: Request, res: Response) => {
  try {
    const loggerUser = req.user as User;
 
    const useCase = new ListUserEventsUseCase();
    const events = await useCase.execute(loggerUser);
    res.status(200).json(events);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(401).json({ message: errorMessage });
  }
});

export { listUserEvents };
