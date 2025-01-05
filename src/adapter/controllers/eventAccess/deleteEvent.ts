import express, { Request, Response } from "express";
import { DeleteEventUseCase } from "../../../application/useCases/deleteEventUseCase";

const deleteEvent = express.Router();

deleteEvent.delete("/:id/delete", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);


    if (!Number.isInteger(numericId) || numericId <= 0) {
      res.status(400).json({
        message: "Invalid ID. It must be a positive integer greater than 0.",
      });
      return;
    }

    const useCase = new DeleteEventUseCase();
    await useCase.execute(numericId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(400).json({ message: errorMessage });
  }
});

export { deleteEvent };
