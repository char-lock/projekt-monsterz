import * as winston from "winston";
import { config } from "./config";

export default class ApiLogger {

  logger = winston.createLogger({
    defaultMeta: { sourceFile: "", sourceFunction: "" },
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      winston.format.prettyPrint({ colorize: true })
    ),
    level: config.debugMode ? "debug" : "warning",
    transports: new winston.transports.Console()
  });

  constructor(filename: string) {
    this.logger.defaultMeta.sourceFile = filename;
  }

  createFunctionLogger(func: string) {
    const newLogger = this.logger;
    newLogger.defaultMeta.sourceFunction = func;
    return newLogger;
  }

  debug(msg: string, meta?: any) {
    this.logger.debug(msg, meta);
  }

  info(msg: string, meta?: any) {
    this.logger.info(msg, meta);
  }

  warn(msg: string, meta?: any) {
    this.logger.warn(msg, meta);
  }

  error(msg: string, meta?: any) {
    this.logger.error(msg, meta);
  }

}
