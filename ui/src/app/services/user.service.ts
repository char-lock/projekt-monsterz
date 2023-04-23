import { Injectable } from "@angular/core";
import { User } from "../types/User";
import { UserSession } from "../types/UserSession";
import { BehaviorSubject } from "rxjs";
import { ValidationService } from "./validation.service";
import { LoggerService } from "./logger.service";
import { NewUser, ValidationMethod } from "../types/api.types";

@Injectable()
export class UserService {

     private currentUser: User = {};

     private currentUserProgressLessonCurrentProgress= new BehaviorSubject<number>(0)
     constructor(
      private validationService: ValidationService,
      private logger: LoggerService
     ) {}
     
     getUser() {
          return this.currentUser;
     }
     revokeUser() {
          this.currentUser = {};
     }
     loadSession(sessionData: UserSession) {
          this.currentUser = sessionData.currentUser;
     }
     getCurrentScore() {
          return this.currentUser.lesson_current ? this.currentUser.lesson_current : 0;
     }
     getCurrentLessonProgressObservable() {
          return this.currentUserProgressLessonCurrentProgress;
     }
     getCurrentLessonProgress() {
          return this.currentUser.lesson_current_progress ? this.currentUser.lesson_current_progress : 0;
     }
     getClassCode() {
          return this.currentUser.verification_value ? this.currentUser.verification_value : "null";
     }
     getCurrentUsername() {
          return typeof this.currentUser.username !== "undefined" ? this.currentUser.username : "";
     }

    /** Creates a new user payload for use during registration. */
    createNewUser(username: string, password: string, validationValue: string): NewUser {
      const isEmail = this.validationService.ValidateEmail(validationValue);
      // TODO: Implement parsing for education codes; right now, the program will
      // accept any value as an education code.
      return {
        username: username,
        password: password,
        validation_method: isEmail 
          ? ValidationMethod.EMAIL 
          : ValidationMethod.EDUCATION_CODE,
        validation_value: validationValue
      };
    }

     updateLessonCurrent (score: number) {
     //Progress for lessons completed.
     if (this.currentUser.lesson_current)
     {
          this.currentUser.lesson_current += score;
     }
     }
     updateLessonCurrentProgress (score: number) {
          if (this.currentUser.lesson_current_progress)
          {
          this.currentUser.lesson_current_progress += score;
          this.currentUserProgressLessonCurrentProgress.next(this.currentUser.lesson_current_progress);  
          }
          else {
               this.currentUser.lesson_current_progress = 0;
               this.currentUser.lesson_current_progress += score;
               this.currentUserProgressLessonCurrentProgress.next(this.currentUser.lesson_current_progress);  
          }
     }
}