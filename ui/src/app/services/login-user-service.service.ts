import { EventEmitter, Injectable, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Account } from "../models/account-model";
import { CookieController } from "./cookie.service";
import { Logger } from "./logger.service";

@Injectable()
export class LogInService {

     private loggedIn = new BehaviorSubject(false);
     currentLoginStatus = this.loggedIn.asObservable();
     constructor(private cookieService: CookieController,
          private logger: Logger) {}
          
     checkForExistingLoginSession() {
          if (this.cookieService.getCookie('previous-login')) {
               this.logger.makeLog("Login Service", "Found account Returning, Logged In Set To True.");
               this.loggedIn.next(true);
          }
          else {
               this.logger.makeLog("Login Service", "No account found Returning");
               this.loggedIn.next(false);
          }
     }
}