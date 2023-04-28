import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject } from "rxjs";
import { LoggerService } from "./logger.service";
import { UserService } from "./user.service";
import { ContentService } from "./content.service";
import { ToastService } from "./toast.service";
import { User } from "../types/api.types";

@Injectable()
export class LoginService {

  private _authToken = "";
  authToken = new BehaviorSubject<string>(this._authToken);

  private _username = "";
  username = new BehaviorSubject<string>(this._username);

  private _user: User | undefined = undefined;
  user = new BehaviorSubject<User | undefined>(this._user);

  constructor(
    private toastService: ToastService,
    private _api: ApiService,
    private _logger: LoggerService
  ) {
    this.username.subscribe((change) => {
      this._api.getUserByUsername(change, (user) => {
        this._user = user;
        this.user.next(this._user);
      });
    });
  }

  log(func: string, message: string, meta?: any) {
    this._logger.log("login.service", func, message, meta);
  }

  /** Requests a new token using the provided credentials. */
  login(username: string, password: string, callback: (n: boolean) => void) {
    username = username.toLowerCase();
    this._api.getAuthToken(username, password, (token: string) => {
      if (token === "") {
        this.log("login", `failed to login as ${username}`);
        this.toastService.createToast("Login failed!\nReason: Unknown", "error");
        return callback(false);
      }
      this._authToken = token;
      this.authToken.next(this._authToken);
      this._username = username;
      this.username.next(this._username);
      callback(true);
    });
  }

}