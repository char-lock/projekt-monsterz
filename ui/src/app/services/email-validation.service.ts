import { Injectable } from "@angular/core";

import { LoggerService } from "./logger.service";

@Injectable()
export class EmailValidationService {

  constructor(private logger: LoggerService) { }

  emailExpression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  passwordExpression: RegExp = /\S{6}/i;

  ValidateEmail(inputText: string) {
    const result: boolean = this.emailExpression.test(inputText);
    this.logger.makeLog('Email Validate', (result ? 'Email Passed Is An Email.' : 'Email Passed Is Not An Email.'));
    return result;
  }
  ValidatePassword(inputText: string) {
    const result: boolean = this.passwordExpression.test(inputText);
    this.logger.makeLog('Password Validate', (result ? 'Password Passed Is A Valid Password.' : 'Password Passed Is Not A Valid Password'));
    return result;
  }
  //Need to move half of the logic to api service.
  IsUniqueEmail(inputText: string) {
    const fetchOptions: RequestInit = {
      method: "GET",
      headers: new Headers({ "Content-Type": "application/json" }),
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
