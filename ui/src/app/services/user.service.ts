import { Injectable } from "@angular/core";
import { User } from "../types/User";
import { UserSession } from "../types/UserSession";

@Injectable()
export class UserService {
     private currentUser: User = {};
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
               lesson_current: 0,
               lesson_current_progress: 0,
               verified: false
          }
          return newUser;
     }
}