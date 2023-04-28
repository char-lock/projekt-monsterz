import { Injectable } from "@angular/core";
import { ApplicationStateService } from "./application-state.service";
import { LoggerService } from "./logger.service";
import { LoginService } from "./login.service";
import { UserRegistrationService } from "./user-registration.service";
import { UserSessionService } from "./user-session.service";
import { UserService } from "./user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ContentService } from "./content.service";
import { ToastService } from "./toast.service";

@Injectable()
export class AppController {
     constructor(
          private applicationStateService: ApplicationStateService,
          private loggerService: LoggerService,
          private loginService: LoginService,
          private userRegistrationService: UserRegistrationService,
          private userSessionService: UserSessionService,
          private userService: UserService,
          private router: Router,
          private contentService: ContentService,
          private route: ActivatedRoute,
          private toaster: ToastService
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
                    this.toaster.createToast("You Are Unable to Be Registered at this Time, Try Again Later", "Error");
                    this.toaster.stopToast();
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
                    this.toaster.createToast("Unable to Login, Try Again", "Error");
                    this.toaster.stopToast();
               }
          });
     }
     goToDashboard() {
          this.router.navigate(["../dashboard"]);
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
               this.toaster.createToast("That Answer is Incorrect, Try Again", "Error");
               this.toaster.stopToast();
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