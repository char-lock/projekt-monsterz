import { Component, EventEmitter, Output } from '@angular/core';
import { Account } from '../models/account-model';
import { MakeApiRequest } from '../services/api-request.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
  constructor (private apiService: MakeApiRequest) {}
  @Output() newContentChangeEvent = new EventEmitter<string>();
  sendEmitterForRegisterScreen(value: string) {
    this.newContentChangeEvent.emit(value);
    console.log("New Content Emitted!");
  }
}
