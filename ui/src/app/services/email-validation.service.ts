import { Injectable } from "@angular/core";

import { LoggerService } from "./logger.service";

@Injectable()
export class EmailValidationService {
    
  constructor(private logger: LoggerService) {}

  expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  ValidateEmail(inputText: string) {
    const result: boolean = this.expression.test(inputText); 
    this.logger.makeLog('Email Validate' , (result ? 'Email Passed Is An Email.' : 'Email Passed Is Not An Email.'));
    return result;
  }

  IsUniqueEmail(inputText: string) {
    const fetchOptions: RequestInit = {
      method: "GET",
      headers: new Headers({"Content-Type": "application/json"}),
      body: "",
      redirect: "follow"
    };
    // TODO: Factor out domain and port for the API to be dynamic based on config.
    return fetch(`http://localhost:8080/users/email/${inputText}`, fetchOptions)
      .then((rawResponse) => {
        if (!rawResponse.body) return true;
        return rawResponse.text()
          .then((bodyText) => {
            const response = JSON.parse(bodyText);
            if (response && response.data && response.data.length > 0) {
              return false;
            }
            return true;
          })
          .catch((textFailReason) => { 
            console.log(textFailReason);
            return false;
          });
      })
      .catch((failReason) => {
        console.log(failReason);
        return true;
      });
  }

}
