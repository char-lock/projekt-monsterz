import { Injectable } from "@angular/core";
import { isDevMode } from "@angular/core";

/** 
 * A service that handles logging to the console during development. 
 * 
 * @class LoggerService
 */
@Injectable()
export class LoggerService {

  /** Logs the provided information to the console. */
  log(sourceFile: string, sourceFunc: string, message: string, meta?: any) {
    if (isDevMode()) {
      const timestamp = new Date(Date.now()).toISOString();
      console.log(`[${timestamp} | DEBUG]: (${sourceFile}::${sourceFunc}) ${message}`);
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
