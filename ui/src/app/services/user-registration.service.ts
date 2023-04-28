import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { LoginService } from "./login.service";
import { NewUser } from "../types/api.types";
import { LoggerService } from "./logger.service";

@Injectable()
export class UserRegistrationService {

  constructor(
    private _api: ApiService,
    private _login: LoginService,
    private _logger: LoggerService
  ) {}

  log(func: string, message: string, meta?: any) {
    this._logger.log("user-registration.service", func, message, meta);
  }

  /** Attempts to register using the provided new user information. */
  register(user: NewUser, callback: (n: boolean) => void) {
    user.username = user.username.toLowerCase();
    this._api.registerUser(user, (registered: User) => {
      if (user.username && user.password) {
        this.log("register", `successfully registered as ${user.username}`);
        this._login.login(user.username, user.password, (success: boolean) => {
          callback(success);
        });
      } else {
        this.log("register", `failed to register as ${user.username}`);
        callback(false);
      }
    });
  }

}
