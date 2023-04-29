import { Injectable } from "@angular/core";
import { LoggerService } from "./logger.service";
import { ApiService } from "./api.service";

/**
 * A service that handles validating input.
 * 
 * @class ValidationService
 */
@Injectable()
export class ValidationService {

  constructor(
    private _api: ApiService, 
    private _logger: LoggerService
  ) {}

  emailExpression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  passwordExpression: RegExp = /\S{6}/i;

  ValidateEmail(inputText: string) {
    const result: boolean = this.emailExpression.test(inputText);
    this._logger.makeLog('Email Validate', (result ? 'Email Passed Is An Email.' : 'Email Passed Is Not An Email.'));
    return result;
  }
  
  ValidatePassword(inputText: string) {
    const result: boolean = this.passwordExpression.test(inputText);
    this._logger.makeLog('Password Validate', (result ? 'Password Passed Is A Valid Password.' : 'Password Passed Is Not A Valid Password'));
    return result;
  }

  isUniqueEmail(inputText: string) {
    let isUnique: boolean | undefined;
    this._api.getUsersByValidationValue(inputText, (users) => {
      isUnique = users.length === 0;
    });
    const startTime = Date.now();
    while (isUnique === undefined) {
      if (Date.now() > (30 * 1000)) { isUnique = true; }
    }
    return isUnique;
  }

}
