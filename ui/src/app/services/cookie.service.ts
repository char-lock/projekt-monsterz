import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Account } from "../models/account-model";
import { Logger } from "./logger.service";

@Injectable()
export class CookieController {
     private cookieValue: string = "";
     constructor(private cookieService: CookieService,
          private logger: Logger) {}

     setCookie(currentAccount: Account) {
          this.cookieService.set('previous-login', JSON.stringify(currentAccount))
          this.logger.makeLog("Cookie Service", "Cookie Created and Set ");
     }
     getCookie(cookieName: string) {
          this.cookieValue = this.cookieService.get('previous-login');
          this.logger.makeLog("Cookie Service", "Cookie Returned: " + this.cookieValue);
          return this.cookieValue;
     }
}
