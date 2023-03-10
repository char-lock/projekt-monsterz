import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Account } from "../models/account-model";

@Injectable()
export class CookieController {
     private cookieValue: string = "";
     constructor(private cookieService: CookieService) {}

     setCookie(currentAccount: Account) {
          this.cookieService.set('previous-login', JSON.stringify(currentAccount))

          this.cookieValue = this.cookieService.get('previous-login');
     }
     getCookie() {
          
     }
}
