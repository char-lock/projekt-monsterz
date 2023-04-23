import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { isDevMode } from "@angular/core";

import * as winston from "winston";

@Injectable()
export class LoggerService {

  defaultLogger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      winston.format.prettyPrint({ colorize: true }),
      winston.format.printf(({ level, message, source, timestamp }) => {
        let msg = winston.format.colorize().colorize(level, `[${timestamp} | ${level}]: `);
        msg += `(${source}) ${message}`
        return msg;
      })
    ),
    defaultMeta: { source: "" },
    level: isDevMode() ? "debug" : "warning",
    transports: new winston.transports.Console()
  });

  createLogger(source: string) {
    const logger = this.defaultLogger;
    logger.defaultMeta = { source: source };
    return logger;
  }

  makeLog(logLocation: string, logValue: string) {
    if (isDevMode()) {
      const logger = this.createLogger(logLocation);
      logger.debug(logValue);
    }
  }

}
