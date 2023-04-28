import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { isDevMode } from "@angular/core";

@Injectable()
export class LoggerService {

  /** Logs the provided information to the console. */
  log(sourceFile: string, sourceFunc: string, message: string, meta?: any) {
    const timestamp = new Date(Date.now()).toISOString();
    console.log(`[${timestamp} | DEBUG]: (${sourceFile}::${sourceFunc}) ${message}`);
    if (meta) console.log(JSON.stringify(meta));
  }

  /** @deprecated Prefer `log`  */
  makeLog(logLocation: string, logValue: string) {
    if (isDevMode()) {
      const timestamp = new Date(Date.now()).toISOString();
      console.log(`[${timestamp} | DEBUG]: (${logLocation}) ${logValue}`);
    }
  }

}
