import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Account } from "../models/account-model";
import { EmailValidate } from "./email-validation.service";
import { Logger } from "./logger.service";
import { CreateUserService } from "./create-user-service.service";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class AccountService {
     constructor(private createUserService: CreateUserService,
          private emailValidate: EmailValidate,
          private cookieService: CookieService,
          private logger: Logger){}

     isEmail: boolean = false;
     currentAccount: Account = {
          id: "",
          username: "",
          authKey: "",
          role: 0,
          verification: {
               verified: false,
               method: 0,
               value: ""
          }
     }
     private currentAccountObservable = new BehaviorSubject(this.currentAccount);
     currentAccountObserve = this.currentAccountObservable.asObservable();

     
     createNewAccount(username: string, password: string, emailOrEducationCode: string) {  
          if (!(username == '' || password == ''))
          {
          this.currentAccount.username = username;
          this.currentAccount.authKey = password; 
          this.currentAccount.verification.value = emailOrEducationCode;
          if (this.emailValidate.ValidateEmail(this.currentAccount.verification.value) == true) {
               this.logger.makeLog("Account Service", "Email Is Validated!");
               this.currentAccount.role = 1;
               this.currentAccount.verification.method = 1;
          }
          else {
               this.logger.makeLog("Account Service", "Email Is Not Valid. Checking For Education Code");

               this.currentAccount.role = 2;
               this.currentAccount.verification.method = 2;
               this.logger.makeLog("Account Service", "*Later Implementation* Check For Existing Education Code");
          }
          this.createUserService.MakeNewAccountAttempt(this.currentAccount);
     }
     }
     checkForExistingAccount(accountUsername: string) {
          return this.currentAccount;
     }
}