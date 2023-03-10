import { Component, EventEmitter, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Logger } from '../services/logger.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private logger: Logger) {
    
  }
  @Output() newContentChangeEvent = new EventEmitter<string>();

  sendEmitterToLogin(value: string) {
    this.newContentChangeEvent.emit(value);
    this.logger.makeLog("Header Component", "Send Emitter to open login form")
  }

}
