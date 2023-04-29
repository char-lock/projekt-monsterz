import { Component } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
  
  constructor(
    private _modal: ModalService,
    private _logger: LoggerService
  ) {}

  /** Opens a modal for the Registration form.  */
  openModal() {
    this._modal.create("register");
  }

}
