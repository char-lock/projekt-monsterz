import { Component, EventEmitter, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() newContentChangeEvent = new EventEmitter<string>();

  sendEmitterToLogin(value: string) {
    this.newContentChangeEvent.emit(value);
    console.log("New Content Emitted!" + value);
  }

}
