import { Router } from "express";
import passport from "passport";
import { GoogleAuthUseCase } from "../../../application/useCases/googleAuthUseCase";
import { User } from "../../../infrastructure/repository/entities/user";
import logger from "../../../utils/logger";
import dotenv from "dotenv";

dotenv.config();
const redirectUrl =  String(process.env.FRONTEND_URL)!;

const google = Router();
const googleCallBack = Router();

google.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

googleCallBack.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    try {
    
      const user = req.user as User; 
     
      const useCase = new GoogleAuthUseCase();
      const loggedUser = await useCase.authenticateUser(user);

     
      res.redirect(`${redirectUrl}/auth/google/callback?token=${loggedUser.token}&user=${JSON.stringify(loggedUser)}`);
    } catch (error) {
      logger.error("Error during Google authentication:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { google, googleCallBack };
