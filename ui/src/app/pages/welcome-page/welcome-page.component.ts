import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppController } from 'src/app/services/app.controller';
import { ApplicationStateService } from 'src/app/services/application-state.service';
import { LoggerService } from 'src/app/services/logger.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
  constructor(
    private appController: AppController,
    private logger: LoggerService,
    private toaster: ToastService
  ) {
  }

  OpenRegistrationModal() {
    this.appController.setModalState(2);
    this.logger.makeLog("Welcome Page Component | Open Registration Modal Function", "Clicked to Set Modal State within App Controller")
  }
}
