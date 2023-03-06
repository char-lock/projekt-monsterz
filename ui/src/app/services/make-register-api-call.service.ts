import { Injectable} from "@angular/core";
import { Account } from "../models/account-model";

@Injectable()
export class makeApiRequest {
    constructor(private currentUser: Account) {}
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
    this.createHeaders();
    this.editRequestOptions();
    
     fetch("http://localhost:8080/users/register", this.requestOptions)
     .then(response => response.text())
     .then(result => console.log(result))
     .catch(error => console.log('error', error));
    }
}
    
    

