import { Injectable } from "@angular/core";
import { User } from "../types/User";
import { UserSession } from "../types/UserSession";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class UserService {
     private currentUser: User = {};
     private currentUserProgressLessonCurrentProgress= new BehaviorSubject<number>(0)
     constructor() {
     }
     setUser(user: User) {
          this.currentUser = user;
     }
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
     createNewUser(username: string, password: string, emailOrEducationCode: string) {
          let newUser: User = {
               username: username,
               auth_key: password,
               user_type: 1,
               verification_method: 1,
               verification_value: emailOrEducationCode,
               lesson_current: 0, //The count of lesson (if 10 lesson), 
               lesson_current_progress: 0, //Percentage of the progress. ^ 10 things in the lesson, be which.
               //Check local. Autosave on some questions. Save on logout and save on session on (move through)
               verified: false
          }
          return newUser;
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