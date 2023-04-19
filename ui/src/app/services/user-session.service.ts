import { Injectable, OnDestroy } from "@angular/core";
import { ApiService } from "./api.service";
import { User } from "../types/User";
import { UserSession } from "../types/UserSession";
import { CookieController } from "./cookie.service";
import { BehaviorSubject, Subject } from "rxjs";
import { Observable } from "rxjs-compat";
import { UserService } from "./user.service";
import { LoggerService } from "./logger.service";
import { LoginService } from "./login.service";

@Injectable()
export class UserSessionService {
  private authToken = "";
  private startedAt: number = -1;
  private lastRefresh: number = -1;
  private currentSubscription;
  constructor(
    private apiService: ApiService,
    private cookieService: CookieController,
    private userService: UserService,
    private logger: LoggerService,
    private loginService: LoginService
  ) {
    this.currentSubscription = this.loginService.getAuthToken().subscribe((value: string) => {
      this.authToken = value;
      this.setSessionDate();
      this.SaveSession();
    })
  }


  IsAuthenticated() {
    if (Date.now() > this.lastRefresh + (900 * 1000) && this.authToken !== "" && this.lastRefresh !== -1) {

      this.logger.makeLog("User Session Service", "Is authenticated call was a success!");
      return this.RefreshAuth().then((result) => { return result; });
    }
    return this.authToken !== ""
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
    this.userService.setUser(sessionData.currentUser);
    this.authToken = sessionData.currentToken;
  }

  RefreshAuth() {
    return this.apiService.RefreshAuthToken(this.authToken)
      .then((refreshResponse) => {
        if (refreshResponse === "") {
          this.RevokeSession();
          console.log(`Failed to refresh: Unknown reason`);
          return false;
        }
        this.lastRefresh = Date.now();
        this.authToken = refreshResponse;
        return true;
      })
      .catch((refreshFailReason) => {
        this.RevokeSession();
        console.log(`Failed to refresh: ${refreshFailReason}`);
        return false;
      });
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
    this.logger.makeLog("User Session Service, Set Session Date", this.lastRefresh.toString())
  }
}