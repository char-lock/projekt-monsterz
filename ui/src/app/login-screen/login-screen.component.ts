import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../models/account-model';
import { MakeApiRequest } from '../services/make-register-api-call.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {
  constructor(private apiMaker: MakeApiRequest) {}
  currentUser: Account = {
    id: '',
    username: '',
    authKey: '',
    role: 0,
    verify: {
      verified: false,
      method: 0,
      value: ''
    }
  }
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
    this.apiMaker.createRaw(this.currentUser);
    this.apiMaker.makeRequest;
  }
}
