import { DataSource } from "typeorm";
import path from 'node:path';
import dotenv from "dotenv";
import "reflect-metadata";
dotenv.config();


const migration = path.join(__dirname, "migrations", "*.{ts,js}");
const entities = path.join(__dirname, "entities", "*.{ts,js}");



export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST?.toString(),
  port: parseInt(process.env.DB_PORT?.toString() || "5432"),
  username: process.env.DB_USERNAME?.toString(),
  password: process.env.DB_PASSWORD?.toString(),
  database: process.env.DB_NAME?.toString(),
  synchronize: false,
  migrationsRun: true,
  logging: false,
  entities: [entities],
  migrations: [migration],
  subscribers: [],
  ssl: process.env.NODE_ENV === "development" ? false : true,
});
