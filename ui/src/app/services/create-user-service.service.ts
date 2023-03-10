import { Injectable} from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Account } from "../models/account-model";
import { CookieController } from "./cookie.service";


@Injectable()
export class CreateUserService {
  constructor (private cookieService: CookieService,
    private cookieController: CookieController) {}

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
  this.cookieService.set("currentUser", JSON.stringify(account))
  this.cookieController.setCookie(account);
  this.cookieController.getCookie();
  console.log("poop"  + this.cookieService.check("currentUser"));
  this.cookieService.set
})
.catch(error => console.log('error', error));
}
}