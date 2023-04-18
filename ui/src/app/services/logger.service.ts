import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import { isDevMode } from "@angular/core";

@Injectable()
export class LoggerService {
  makeLog(logLocation: string, logValue: string) {
    if (isDevMode()) {
      console.log("Found here: " + logLocation + ": " + logValue);
    }
  }
}