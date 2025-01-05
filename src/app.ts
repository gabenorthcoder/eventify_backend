import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { eventRoutes } from "./adapter/routes/eventRoutes";
import { userRoutes } from "./adapter/routes/userRoutes";
import { authRoutes } from "./adapter/routes/authRoutes";
import { superAdminRoutes } from "./adapter/routes/superAdminRoutes";
import { adminRoutes } from "./adapter/routes/adminRoutes";
import passport from "passport";
import "./infrastructure/googleStrategy";

dotenv.config();

const app = express();
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000"];

const corsOptions = {
  origin: corsOrigins,
  
};

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Eventify API",
    version: "1.0.0",
    description: "API documentation for Events Platform",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};
;

const options = {
  swaggerDefinition,
  apis: ["./src/adapter/routes/*/*.ts"], 
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/events", eventRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/super-admin", superAdminRoutes);
app.use("*", (req: Request, res: Response) => {
  res.redirect("https://events-platform-coral-rho.vercel.app");
});

export { app };
