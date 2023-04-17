import { Component, EventEmitter, Output } from '@angular/core';
import { Logger } from '../services/logger.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  constructor(private logger: Logger){}
  content: string = "Sample Alert!"
  @Output() newContentChangeEvent = new EventEmitter<string>();

  sendEmitterToExitLoginScreen(value: string) {
    this.newContentChangeEvent.emit(value);
    this.logger.makeLog("Login Screen", "Exitted Login Screen")
  }
}
