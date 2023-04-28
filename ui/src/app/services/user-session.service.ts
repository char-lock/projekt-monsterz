import { Injectable, OnDestroy } from "@angular/core";
import { ApiService } from "./api.service";
import { UserSession } from "../types/UserSession";
import { CookieController } from "./cookie.service";
import { UserService } from "./user.service";
import { LoggerService } from "./logger.service";
import { LoginService } from "./login.service";

@Injectable()
export class UserSessionService {

  private authToken = "";
  private startedAt: number = -1;
  private lastRefresh: number = -1;

  constructor(
    private _api: ApiService,
    private cookieService: CookieController,
    private userService: UserService,
    private _logger: LoggerService,
    private _login: LoginService
  ) {
    this._login.authToken.subscribe((change) => {
      this.authToken = change;
      this.lastRefresh = Date.now();
      if (this.startedAt === -1) this.startedAt = Date.now();
    });
  }

  log(func: string, message: string, meta?: any) {
    this._logger.log("user-session.service", func, message, meta);
  }

  /** Returns whether or not the current authToken needs to be refreshed. */
  get needRefresh() {
    return (Date.now() > this.lastRefresh + (15 * 60 * 1000)
      && this.authToken !== ""
      && this.lastRefresh !== -1);
  }

  isAuthenticated() {
    if (this.needRefresh) {
      this.refresh();
    }
    return this.authToken !== "";
  }

  refresh() {
    this._api.refreshAuthToken(this.authToken, (token) => {
      this.authToken = token;
    });
  }

  GetSessionData() {
    const sessionData: UserSession = {
      currentUser: this.userService.getUser(),
      currentToken: this.authToken
    };
    return sessionData;
  }

  SaveSession() {
    this.cookieService.SaveSessionAsCookie(this.GetSessionData());
  }

  LoadSession(sessionData: UserSession) {
    if (sessionData.currentUser === undefined) {
      return this.log("LoadSession", "User not set in saved session");
    }
    this.userService.setUser(sessionData.currentUser);
    this.authToken = sessionData.currentToken;
  }

  RevokeSession() {
    this.authToken = "";
    this.startedAt = -1;
    this.lastRefresh = -1;
    this.cookieService.RevokeCookie();
  }

  setSessionDate() {
    this.startedAt = Date.now();
    this.lastRefresh = Date.now();
    this.log("Set Session Date", this.lastRefresh.toString())
  }

}
