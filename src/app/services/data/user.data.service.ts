import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class UserDataService {
  
  CreateUser(user: object) {}

  CreateUserProgress(userProgress: object) {}

  EditUser(userId: number, user: object) {}

  EditUserProgress(userId: number, userProgress: object) {}

  GetUserById(userId: number) {}

  GetUserByUsername(username: string) {}

  GetUserByValidationValue(value: string, which: number = -1) {}

  GetUserProgressById(userId: number) {}

  GetUserValidationById(userId: number) {}

  DeleteUserById(userId: number) {}

  DeleteUserProgressById(userId: number) {}

  DeleteUserValidationById(userId: number) {}

}
