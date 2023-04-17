import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AuthDataService {
  
  CreateUserAuth(userAuth: object) {}

  ValidateUser(username: string, authKey: string) {}

  DeleteUserAuthById(userId: number) {}

}
