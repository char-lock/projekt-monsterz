import { Injectable} from "@angular/core";
import { Account } from "../models/account-model";
import { Accounts } from "./accounts.service";


@Injectable()
export class MakeApiRequest {
    myHeaders = new Headers();
    requestOptions: RequestInit = {};
    raw: any;
    createHeaders() {
      this.myHeaders.append("Content-Type", "application/json");
    }
    createRaw(currentUser: Account) {
      this.raw = JSON.stringify(
        currentUser
      )
    }
    editRequestOptions() {
     let requestOptions: RequestInit = {
        method: 'POST',
        headers: this.myHeaders,
        body: this.raw,
        redirect: 'follow'
      };
    }
    makeRequest() {
      console.log("fuck!");

    this.createHeaders();
    this.editRequestOptions();

     fetch("http://localhost:8080/users/register", this.requestOptions)
     .then(response => response.text())
     .then(result => console.log(result))
     .catch(error => console.log('error', error));

    }
    
}
    
    

