import { Injectable } from "@angular/core";
import { Logger } from "./logger.service";

@Injectable()
export class EmailValidate {
     expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

     constructor(private logger: Logger) {
     }

     ValidateEmail(inputText: string) {
          const result: boolean = this.expression.test(inputText); 
          this.logger.makeLog('Email Validate' , (result ? 'Email Passed Is An Email.' : 'Email Passed Is Not An Email.'));
          return result;
     }

}

