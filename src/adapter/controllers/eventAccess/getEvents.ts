import express, { Request, Response } from "express";
import { GetEventsUseCase } from "../../../application/useCases/getEventsUseCase";
import { User } from "../../../infrastructure/repository/entities/user";
import { AuthMiddlewareService } from "../../../infrastructure/middleware/authMiddlewareService";
import { PaginationParams } from "../../../infrastructure/repository/eventRepository";



const getEvents = express.Router();

getEvents.get("/read", async (req: Request, res: Response) => {

  const params = req.query as PaginationParams

  try {
    const authMiddlewareService = new AuthMiddlewareService()
    const useCase = new GetEventsUseCase();
    const authHeader = req.headers.authorization;

    if (authHeader === undefined) {
      const events = await useCase.execute(params);
      res.status(200).json(events);
    }else{
      const token = authHeader.split(" ")[1];
      const result = await authMiddlewareService.verifyToken(token);
      const loggerUser = result.user as User;
  
  
      // Execute the use case to fetch all active events
      const events = await useCase.execute(params,loggerUser);
  
      res.status(200).json(events);
    }
  
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(500).json({ message: errorMessage });
  }
});

export { getEvents };
