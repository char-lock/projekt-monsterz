import { Account } from "../models/account-model";
import { makeApiRequest } from "./make-register-api-call.service";

export class Accounts {
     constructor(private account: Account,
          private apiCall: makeApiRequest) {}
     createNewAccountWithEmail(username: string, password: string, email: string) {
          this.account.addUsernameAndPasswordAndRole(username, password, 1);
          this.account.editVerify(false, 1, email);
          this.apiCall.createRaw(this.account);
          this.apiCall.makeRequest();
     }
     createNewAccountWithEducationCode() {

     }
}