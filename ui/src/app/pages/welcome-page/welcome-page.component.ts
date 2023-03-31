import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApplicationStateService } from 'src/app/services/application-state.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
  constructor(
    private appState: ApplicationStateService
  ) {}

  OpenRegistrationModal() {
    this.appState.SetLoginModalState(2);
  }
}
