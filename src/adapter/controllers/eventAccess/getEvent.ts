import express, { Request, Response } from "express";
import { GetEventUseCase } from "../../../application/useCases/getEventUseCase";




const getEvent = express.Router();

getEvent.get("/:eventId/event", async (req: Request, res: Response) => {

 const { eventId } = req.params; 
    const numericId = Number(eventId);


    if (!Number.isInteger(numericId) || numericId <= 0) {
      res.status(400).json({
        message: "Invalid ID. It must be a positive integer greater than 0.",
      });
      return;
    }
  try {
    const useCase = new GetEventUseCase();
      const event = await useCase.execute(numericId);
      res.status(200).json(event);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(500).json({ message: errorMessage });
  }
});

export { getEvent };
