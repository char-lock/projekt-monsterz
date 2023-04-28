import { Injectable } from "@angular/core";
import { UserSession } from "../types/UserSession";
import { LoggerService } from "./logger.service";

/** 
 * A service that handles any cookie-related operations for the
 * application.
 * 
 * @class CookieService
 */
@Injectable()
export class CookieService {

  constructor(private _logger: LoggerService) {}

  /** Logs a message to the console source from the CookieService. */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("cookie.service", func, message, meta);
  }

  /** 
   * Saves the provided string value to a cookie with the provided
   * label.
   */
  saveAs(label: string, content: string) {
    const expiresOn = new Date(Date.now() + (60 * 60 * 1000));
    const cookieData = [
      `${label}=${content}`,
      `expires="${expiresOn.toUTCString()}"`,
      `path=/`
    ].join("; ");
    this.log("saveAs", `Saving new cookie ...\n${cookieData}`);
    document.cookie = [
      `${label}=${content}`,
      `expires="${expiresOn.toUTCString()}"`,
      `path=/`
    ].join("; ");
  }

  /** Returns the data stored within a cookie with the matching label. */
  load(label: string) {
    this.log("load", `loading cookie with label "${label}" ...`);
    const cookies = `; ${document.cookie}`.split(`; ${label}=`);
    if (cookies.length === 2) {
        let data = cookies.pop();
        if (data) {
          data = data.split(";").shift();
          this.log("load", `value found in cookie "${label}": ${data}`);
          if (data) return data;
        }
    }
    return "";
  }

  /** Deletes all data for the specified cookie. */
  delete(label: string) {
    this.log("delete", `deleting cookie with label "${label}" ...`);
    const expiresOn = new Date(Date.now() + (-1 * 24 * 60 * 60 * 1000));
    document.cookie = [
      `${label}=;`,
      `expires=${expiresOn.toUTCString()}`,
      `path=/`
    ].join("; ");
  }

}
