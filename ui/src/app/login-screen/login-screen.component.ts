import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../models/account-model';
import { AccountService } from '../services/account-service.service';
import { MakeApiRequest } from '../services/api-request.service';
import { EmailValidate } from '../services/email-validation.service';
import { Logger } from '../services/logger.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {
  constructor(private checkEmail: EmailValidate,
    private logger: Logger,
    private accountService: AccountService,
    private apiRequester: MakeApiRequest) {}

  @Output() newContentChangeEvent = new EventEmitter<string>();
  @Input() currentForm = '';
  getSelectedForm(value: string) {
    this.currentForm = value;
  }
  sendEmitterToExitLoginScreen(value: string) {
    this.newContentChangeEvent.emit(value);
    console.log("New Content Emitted!" + value);
    this.currentForm = value;
  }
  onSubmit() {
    this.logger.makeLog("Login Screen", "Made API request");
    this.apiRequester.makeApiRequest();

  }
}
