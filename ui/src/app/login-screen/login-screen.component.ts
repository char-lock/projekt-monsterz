import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AccountService } from '../services/account-service.service';
import { EmailValidate } from '../services/email-validation.service';
import { Logger } from '../services/logger.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {
  @Output() newContentChangeEvent = new EventEmitter<string>();

  constructor(private checkEmail: EmailValidate,
    private logger: Logger,
    private accountService: AccountService) {}

  sendEmitterToExitLoginScreen(value: string) {
    this.newContentChangeEvent.emit(value);
    this.logger.makeLog("Login Screen", "Exitted Login Screen")
  }
  onSubmit(username: string, password: string, emailOrEducationCode: string) {
    this.sendEmitterToExitLoginScreen('close');
    this.accountService.createNewAccount(username, password, emailOrEducationCode);
    this.logger.makeLog("Login Screen", "Sent username, string and email or education code to Account Service: " + username + " " + password + " " + emailOrEducationCode);
  }
}
