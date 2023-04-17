import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject, Subject, Subscriber, Subscription } from "rxjs";
import { UserSessionService } from "./user-session.service";
import { LoggerService } from "./logger.service";
import { UserService } from "./user.service";

@Injectable()
export class LoginService {
     private authToken = "";
     private currentAuthToken = new BehaviorSubject<string>("");
     constructor(private apiService: ApiService,
          private logger: LoggerService,
          private userService: UserService) {
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
                    this.setAuthToken();
                    this.apiService.GetUserByUsername(username)
                         .then((userResponse) => {
                              if (!userResponse) {
                                   console.log(`Failed to retrieve user: Unknown reason`);
                                   callback(false);
                                   return;
                              }
                              this.userService.setUser(userResponse);

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
     setAuthToken() {
          this.currentAuthToken.next(this.authToken);
     }
     getAuthToken() {
          return this.currentAuthToken;
     }
}