import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject, Subject, Subscriber, Subscription } from "rxjs";
import { UserSessionService } from "./user-session.service";
import { LoggerService } from "./logger.service";
import { UserService } from "./user.service";
import { ContentService } from "./content.service";

@Injectable()
export class LoginService {
  
  private authToken = "";
  private currentAuthToken = new BehaviorSubject<string>("");
  
  constructor(
      private apiService: ApiService,
      private logger: LoggerService,
      private userService: UserService,
      private contentService: ContentService
  ) {}
  
  /** Attempts to login as the provided user. */
  LoginAs(username: string, password: string, callback: Function) {
    this.apiService.getAuthToken(username, password)
      .then((tokenResponse) => {
        if (tokenResponse === "") {
          this.logger.makeLog("login.service::LoginAs", "failed to login: unknown reason");
          return callback(false);
        }
        this.authToken = tokenResponse;
        this.setAuthToken();
        this.apiService.getUserByUsername(username)
          .then((userResponse) => {
            if (!userResponse) {
              this.logger.makeLog("login.service::LoginAs", "failed to retrieve user");
              return callback(false);
            }
            this.userService.setUser(userResponse);
            this.contentService.updateQuestionList();
            return callback(true);
          })
          .catch((userFailReason) => {
            this.logger.makeLog("login.service::LoginAs", `failed to retrieve user - reason: ${userFailReason}`);
            return callback(false);
          });
      })
      .catch((tokenFailReason) => {
        this.logger.makeLog("login.service::LoginAs", `failed to login - reason: ${tokenFailReason}`);
        return callback(false);
      });
    }
    
    setAuthToken() {
      this.currentAuthToken.next(this.authToken);
    }

    getAuthToken() {
      return this.currentAuthToken;
    }

}