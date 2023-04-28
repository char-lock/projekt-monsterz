import { Injectable } from "@angular/core";
import { ApplicationStateService } from "./application-state.service";
import { LoggerService } from "./logger.service";
import { UserRegistrationService } from "./user-registration.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ContentService } from "./content.service";
import { ToastService } from "./toast.service";
import { ValidationMethod } from "../types/api.types";
import { ValidationService } from "./validation.service";

@Injectable()
export class AppController {
     constructor(
          private applicationStateService: ApplicationStateService,
          private loggerService: LoggerService,
          private router: Router,
          private contentService: ContentService,
          private route: ActivatedRoute,
          private toaster: ToastService,
          private validationService: ValidationService
     ) {
     }
     setModalState(number: number) {
          this.loggerService.makeLog("App Controller | Set Modal State function", "Passed Modal State Number to Application State Service")
          this.applicationStateService.SetLoginModalState(number);
     }
     Register(username: string, password: string, emailOrEducationCode: string) {
          this.userRegistrationService.register(
            {
              username: username,
              password: password,
              validation_method: this.validationService.ValidateEmail(emailOrEducationCode)
                ? ValidationMethod.EMAIL
                : ValidationMethod.EDUCATION_CODE,
              validation_value: emailOrEducationCode
            }, (success: boolean) => {
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
          this.loginService.login(username, password, (success: boolean) => {
               if (success) {
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
          if (this.contentService.checkAnswer(value)) {
               this.userService.updateLessonCurrentProgress(10);
               this.contentService.nextContent();
          }
          else {
               this.loggerService.makeLog("app.controller::checkForRightAnswer", "incorrect");
               this.toaster.createToast("That Answer is Incorrect, Try Again", "Error");
               this.toaster.stopToast();
          }
     }
     checkForAuthentication() {
          if (!this.userSessionService.isAuthenticated()) {
               this.router.navigate(["../"]);
               return;
          }
          else {
          }
     }
     finishReading() {
          this.userService.updateLessonCurrentProgress(10);
          this.contentService.nextContent();
     }

}