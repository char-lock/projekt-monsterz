import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ApplicationStateService } from "./application-state.service";
import { CookieService } from "ngx-cookie-service";
import { ValidationService } from "./validation.service";
import { LeaderboardService } from "./leaderboard.service";
import { LoggerService } from "./logger.service";
import { LoginService } from "./login.service";
import { UserRegistrationService } from "./user-registration.service";
import { UserSessionService } from "./user-session.service";
import { UserService } from "./user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../types/User";
import { BehaviorSubject } from "rxjs";
import { ContentService } from "./content.service";
import { LessonModuleComponent } from "../pages/lesson-modules/lesson-module.component";

@Injectable()
export class AppController {
     constructor(
          private apiService: ApiService,
          private applicationStateService: ApplicationStateService,
          private cookieService: CookieService,
          private validationService: ValidationService,
          private leaderboardService: LeaderboardService,
          private loggerService: LoggerService,
          private loginService: LoginService,
          private userRegistrationService: UserRegistrationService,
          private userSessionService: UserSessionService,
          private userService: UserService,
          private router: Router,
          private contentService: ContentService,
          private route: ActivatedRoute,
     ) {
     }
     setModalState(number: number) {
          this.loggerService.makeLog("App Controller | Set Modal State function", "Passed Modal State Number to Application State Service")
          this.applicationStateService.SetLoginModalState(number);
     }
     Register(username: string, password: string, emailOrEducationCode: string) {
          this.userRegistrationService.AttemptRegistration(this.userService.createNewUser(username, password, emailOrEducationCode), (success: boolean) => {
               if (success) {
                    this.applicationStateService.SetLoginModalState(0);
                    this.router.navigate(["../dashboard"]);
               } else {
                    // TODO: Handle registration failure
               }
          });
          this.loggerService.makeLog("component.login-screen", "Requested a registration attempt.");
     }
     Login(username: string, password: string) {
          this.loginService.LoginAs(username, password, (success: boolean) => {
               if (success) {
                    this.applicationStateService.SetLoginModalState(0);
                    this.router.navigate(["../dashboard"]);
                    this.loggerService.makeLog("App Controller", "Should've navigated to Dashboard!")
               } else {
                    // TODO: Handle login failure
               }
          });
     }
     logOut() {
          this.userSessionService.RevokeSession();
          this.router.navigate([".."]);
     }
     checkForRightAnswer(value: string) {
          if (this.contentService.checkForCorrectAnswer(value)) {
               this.userService.updateLessonCurrentProgress(10);
               this.contentService.nextActivity();
          }
          else {
               this.loggerService.makeLog("app.controller::checkForRightAnswer", "incorrect");
               //Display error!
          }
     }
     checkForAuthentication() {
          if (!this.userSessionService.IsAuthenticated()) {
               this.router.navigate(["../"]);
               return;
          }
          else {
          }
     }
     finishReading() {
          this.userService.updateLessonCurrentProgress(10);
          this.contentService.nextActivity();
     }

}