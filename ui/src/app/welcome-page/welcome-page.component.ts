import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
  @Output() newContentChangeEvent = new EventEmitter<string>();
  sendEmitterForRegisterScreen(value: string) {
    this.newContentChangeEvent.emit(value);
    console.log("New Content Emitted!");
  }
}
