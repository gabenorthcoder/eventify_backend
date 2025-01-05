import { app } from "./app";
import { AppDataSource } from "./infrastructure/repository/dataSource";
import logger from "./utils/logger";
import dotenv from "dotenv";

dotenv.config();


const port = process.env.PORT || 3000;
const swaggerUrl =
  process.env.NODE_ENV === "production"
    ? `${process.env.API_BASE_URL}/api-docs` 
    : `http://localhost:${port}/api-docs`;

 

    
export async function startServer() {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established successfully.");

    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Swagger UI available at ${swaggerUrl}`);
    });
  } catch (e) {
    logger.error("Error connecting to the database", e);
    process.exit(1);
  }
}

startServer();
