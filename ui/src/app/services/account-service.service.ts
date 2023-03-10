import { Injectable } from "@angular/core";
import { Account } from "../models/account-model";
import { MakeApiRequest } from "./api-request.service";

@Injectable()
export class AccountService {
     constructor(private apiRequester: MakeApiRequest,
          private account: Account){}
     createNewAccountWithEmail(account: Account) {   
          this.account = account;
     }
     createNewAccountWithEducationCode(account: Account) {
          
     }
}