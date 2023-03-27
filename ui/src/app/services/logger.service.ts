import { Injectable } from "@angular/core";

@Injectable()
export class Logger {
     makeLog(logLocation: string,logValue: string) {
          console.log("Found at " + logLocation);
          console.log("Log Value: " + logValue);
     }
}