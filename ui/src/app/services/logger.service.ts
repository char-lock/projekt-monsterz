import { Injectable } from "@angular/core";
import { isDevMode } from "@angular/core";

/** 
 * A service that handles logging to the console during development. 
 * 
 * @class LoggerService
 */
@Injectable()
export class LoggerService {

  /** 
   * Formats and writes the provided information to the console.
   *
   * @param sourceFile File from which the log originates
   * 
   * @param sourceFunc Function from which the log originates
   * 
   * @param message Content of the log
   * 
   * @param meta (Optional) Any additional data or information to log 
   */
  log(sourceFile: string, sourceFunc: string, message: string, meta?: any) {
    if (isDevMode()) {
      const timestamp = new Date(Date.now()).toISOString();
      console.log(
        `[${timestamp} | DEBUG]: `
        + `(${sourceFile}::${sourceFunc}) ${message}`
      );
      if (meta) console.log(JSON.stringify(meta));
    }
  }

  /** @deprecated Prefer `log`  */
  makeLog(logLocation: string, logValue: string) {
    if (isDevMode()) {
      const timestamp = new Date(Date.now()).toISOString();
      console.log(`[${timestamp} | DEBUG]: (${logLocation}) ${logValue}`);
    }
  }

}
