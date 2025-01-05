
import { createLogger, format, transports } from "winston";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "orange"
  },
};

const logger = createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),
  ],
});

import * as winston from "winston";
winston.addColors(customLevels.colors);

export default logger;
