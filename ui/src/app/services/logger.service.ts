import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { isDevMode } from "@angular/core";

@Injectable()
export class LoggerService {
  makeLog(logLocation: string,logValue: string) {
    if (isDevMode()) {
      // console.log(".................................................. [" + formatDate(Date.now(), "YYYY-MM-DD HH:mm:ss.SS", "US") + "] ..........");
      console.log("from " + logLocation + " -> " + logValue);
      console.log("..................................................................................."); 
    }
  }
}