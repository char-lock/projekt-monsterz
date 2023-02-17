import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {
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
}
