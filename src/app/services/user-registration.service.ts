import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";
import { CookieController } from "./cookie.service";
import { UserSessionService } from "./user-session.service";

import { User } from "../types/User";
import { LoginService } from "./login.service";

@Injectable()
export class UserRegistrationService {
  constructor(
    private apiService: ApiService,
    private loginService: LoginService
  ) { }

  AttemptRegistration(user: User, callback: Function) {
    user.username = user.username?.toLowerCase();
    this.apiService.RegisterUser(user)
      .then((registerResponse) => {
        if (typeof registerResponse === "undefined") {
          console.log(`Failed to register: Unknown reason`);
          callback(false);
          return;
        }
        if (user.auth_key && user.username) {
          this.loginService.LoginAs(user.username, user.auth_key, callback);
        } else {
          callback(false);
        }
      })
      .catch((registerFailReason) => {
        console.log(`Failed to register: ${registerFailReason}`);
        callback(false);
      });
  }
}
