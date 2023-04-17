import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { ApplicationStateService } from 'src/app/services/application-state.service';

import { UserSessionService } from 'src/app/services/user-session.service';
import { CookieController } from '../../services/cookie.service';
import { LoggerService } from '../../services/logger.service';
import { AppController } from 'src/app/services/app.controller';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLogin: boolean = false;
  modalState = 0;
  constructor(
    private logger: LoggerService,
    private userSession: UserSessionService,
    private appState: ApplicationStateService,
    private router: Router,
    private appController: AppController
  ) {
    this.appState.getModalState().subscribe((modalStateValue) => {
      this.modalState = modalStateValue;
    });
  }

  ngOnInit() { }

  IsLoginModalOpen() {
    return this.modalState > 0 && !this.userSession.IsAuthenticated();
  }
  IsLoggedIn() {
    return this.userSession.IsAuthenticated();
  }
  OpenLoginModal() {
    return this.appController.setModalState(1);
  }
  Logout() {
    this.appController.logOut()
    this.logger.makeLog("header.component", "logged user out");
  }
}
