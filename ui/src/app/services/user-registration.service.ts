import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";
import { CookieController } from "./cookie.service";
import { UserSessionService } from "./user-session.service";

import { User } from "../types/User";
import { LoginService } from "./login.service";
import { NewUser } from "../types/api.types";

@Injectable()
export class UserRegistrationService {
  constructor(
    private apiService: ApiService,
    private loginService: LoginService
  ) { }

  AttemptRegistration(user: NewUser, callback: Function) {
    user.username = user.username?.toLowerCase();
    this.apiService.registerUser(user)
      .then((registerResponse) => {
        if (typeof registerResponse === "undefined") {
          console.log(`Failed to register: Unknown reason`);
          callback(false);
          return;
        }
        if (user.password && user.username) {
          this.loginService.LoginAs(user.username, user.password, callback);
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
