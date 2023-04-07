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
     LoadSession(sessionData: UserSession) {
          this.currentUser = sessionData.currentUser;
     }
     GetCurrentScore() {
          return this.currentUser.lesson_current ? this.currentUser.lesson_current : 0;
     }
     GetClassCode() {
          return this.currentUser.verification_value ? this.currentUser.verification_value : "null";
     }
     GetCurrentUsername() {
          return typeof this.currentUser.username !== "undefined" ? this.currentUser.username : "";
     }
}