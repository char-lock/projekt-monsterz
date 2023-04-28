import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { UserSession } from "../types/UserSession";
import { LoggerService } from "./logger.service";

@Injectable()
export class CookieController {
  constructor(
    private cookieService: CookieService,
    private logger: LoggerService
  ) { }

  SaveSessionAsCookie(session: UserSession) {
    this.cookieService.set('projekt-monsterz.session', JSON.stringify(session));
    this.logger.makeLog("cookie.service", "Created cookie with current session data.");
  }

  RevokeCookie() {
    this.cookieService.set("projekt-monsterz.session", "");
    this.logger.makeLog("cookie.service", "Cleared cookie data");
  }

}
