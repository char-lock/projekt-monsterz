import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";
import { CookieController } from "./cookie.service";
import { UserSessionService } from "./user-session.service";

import { User } from "../types/User";
import { LoginService } from "./login.service";
import { NewUser } from "../types/api.types";
import { LoggerService } from "./logger.service";

@Injectable()
export class UserRegistrationService {

  constructor(
    private apiService: ApiService,
    private loginService: LoginService,
    private logger: LoggerService
  ) { }

  AttemptRegistration(user: NewUser, callback: Function) {
    user.username = user.username.toLowerCase();
    this.apiService.registerUser(user)
      .then((registerResponse) => {
        if (registerResponse === undefined) {
          this.logger.makeLog("user-registration.service", "failed to register");
          return callback(false);
        }
        if (user.password && user.username) {
          this.logger.makeLog("user-registration.service", `successfully registered -- id = ${registerResponse.id}`);
          this.loginService.LoginAs(user.username, user.password, callback);
        } else {
          callback(false);
        }
      })
      .catch((registerFailReason) => {
        this.logger.makeLog("user-registration.service", `failed to register - reason: ${registerFailReason}`);
        callback(false);
      });
  }

}
