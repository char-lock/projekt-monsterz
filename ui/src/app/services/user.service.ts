import { Injectable } from "@angular/core";
import { User } from "../types/api.types";
import { UserSession } from "../types/UserSession";
import { BehaviorSubject } from "rxjs";
import { ValidationService } from "./validation.service";
import { LoggerService } from "./logger.service";
import { NewUser, ValidationMethod } from "../types/api.types";

@Injectable()
export class UserService {

     private currentUser: User | undefined;

     private currentUserProgressLessonCurrentProgress = new BehaviorSubject<number>(0)
     constructor(
          private validationService: ValidationService,
          private logger: LoggerService
     ) { }

     getUser() {
          return this.currentUser;
     }

     setUser(user: User) {
          this.currentUser = user;
     }

     revokeUser() {
          this.currentUser = undefined;
     }
     loadSession(sessionData: UserSession) {
          this.currentUser = sessionData.currentUser;
     }
     getCurrentScore() {
          return this.currentUser?.progress_lesson ? this.currentUser.progress_lesson : 0;
     }
     getCurrentLessonProgressObservable() {
          return this.currentUserProgressLessonCurrentProgress;
     }
     getCurrentLessonProgress() {
          return this.currentUser?.progress_content ? this.currentUser?.progress_content : 0;
     }
     getClassCode() {
          return this.currentUser?.validation_value ? this.currentUser.validation_value : "null";
     }
     getCurrentUsername() {
          return this.currentUser?.username !== undefined ? this.currentUser.username : "";
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

     getCurrentContentId() {
          return this.currentUser?.progress_content ? this.currentUser?.progress_content : 0;
     }

     updateLessonCurrent(lessonId: number) {
          //Progress for lessons completed.
          if (this.currentUser?.progress_lesson) {
               this.currentUser.progress_lesson = lessonId;
          }
     }

     updateLessonCurrentProgress(contentId: number) {
          
     }
     updateLessonProgress() {
          this.currentUser!.progress_content++;
          this.currentUserProgressLessonCurrentProgress.next(this.currentUser!.progress_content)
          console.log(this.currentUser!.progress_content);
     }
}
