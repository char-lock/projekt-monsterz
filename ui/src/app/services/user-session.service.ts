import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { User } from "../types/User";
import { UserSession } from "../types/UserSession";
import { CookieController } from "./cookie.service";

@Injectable()
export class UserSessionService {

  private currentUser: User = {};
  private authToken: string = "";
  private startedAt: number = -1;
  private lastRefresh: number = -1;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieController
  ) {}

  IsAuthenticated() {
    if (Date.now() > this.lastRefresh + (900 * 1000) && this.authToken !== "" && this.lastRefresh !== -1) {
      return this.RefreshAuth().then((result) => { return result; });
    }
    return this.authToken !== "" && typeof this.currentUser.username !== "undefined";
  }

  GetCurrentUsername() {
    return typeof this.currentUser.username !== "undefined" ? this.currentUser.username : "";
  }

  GetCurrentScore() {
    return this.currentUser.lesson_current ? this.currentUser.lesson_current : 0;
  }

  GetClassCode() {
    return this.currentUser.verification_value ? this.currentUser.verification_value : "null";
  }

  GetSessionData() {
    const sessionData: UserSession = {
      currentUser: this.currentUser,
      currentToken: this.authToken
    };
    return sessionData;
  }

  SaveSession() {
    this.cookieService.SaveSessionAsCookie(this.GetSessionData());
  }

  LoadSession(sessionData: UserSession) {
    this.currentUser = sessionData.currentUser;
    this.authToken = sessionData.currentToken;
  }

  LoginAs(username: string, password: string, callback: Function) {
    this.apiService.GetAuthToken(username, password)
      .then((tokenResponse) => {
        if (tokenResponse === "") {
          console.log(`Failed to login: Unknown reason`);
          callback(false);
          return;
        }
        this.authToken = tokenResponse;
        this.apiService.GetUserByUsername(username)
          .then((userResponse) => {
            if (!userResponse) {
              console.log(`Failed to retrieve user: Unknown reason`);
              callback(false);
              return;
            }
            this.currentUser = userResponse;
            this.startedAt = Date.now();
            this.lastRefresh = Date.now();
            this.SaveSession();
            callback(true);
            return;
          })
          .catch((userFailReason) => {
            console.log(`Failed to retrieve user: ${userFailReason}`);
            callback(false);
            return;
          });
      })
      .catch((tokenFailReason) => {
        console.log(`Failed to login: ${tokenFailReason}`);
        callback(false);
        return;
      });
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
    this.currentUser = {};
    this.startedAt = -1;
    this.lastRefresh = -1;
    this.cookieService.RevokeCookie();
  }

}