import { Injectable} from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Account } from "../models/account-model";
import { CookieController } from "./cookie.service";
import { Logger } from "./logger.service";
import { LogInService } from "./login-user-service.service";


@Injectable()
export class CreateUserService {
  constructor (
    private cookieController: CookieController,
    private logger: Logger,
    private login: LogInService) {}

  MakeNewAccountAttempt(account: Account) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(account);
var requestOptions: RequestInit = {
method: 'POST',
headers: myHeaders,
body: raw,
redirect: 'follow'
};
fetch("http://localhost:8080/users/register", requestOptions)
.then(response => response.text())
.then(result => {
  console.log(result);
  this.cookieController.setCookie(account);
  this.logger.makeLog("Create User Service", "Cookie Created for: " + account);
  this.login.checkForExistingLoginSession();
})
.catch(error => console.log('error', error));
}
}