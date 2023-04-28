import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserSessionService } from 'src/app/services/session.service';
import { ValidationService } from '../../services/validation.service';
import { LoggerService } from '../../services/logger.service';

import { User } from 'src/app/types/User';
import { ApplicationStateService } from 'src/app/services/application-state.service';
import { LoginService } from 'src/app/services/login.service';
import { AppController } from 'src/app/services/app.controller';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {
  modalState = 0;
  constructor(
    private logger: LoggerService,
    private appState: ApplicationStateService,
    private applicationController: AppController
  ) {
    this.appState.getModalState().subscribe((modalStateValue) => {
      this.modalState = modalStateValue;
    });
  }

  ngOnInit() {
    window.onclick = ($event) => {
      if ($event.target instanceof HTMLElement) {
        if (
          $event.target.closest(".login-modal-container") === null
          && this.modalState == 0
          && !$event.target.classList.contains("arcade-btn")
          && !$event.target.classList.contains("nav-item")
        ) {
          this.SetModalState(0);
        }
      }
    }

    document.onkeydown = ($event) => {
      const key = $event.key;
      if (key === "Enter") {
        if (this.modalState == 1) {
          document.getElementById("login-btn")?.click();
        } else if (this.modalState == 2) {
          document.getElementById("register-btn")?.click();
        }
      }
    }
  }
  SetModalState(number: number) {
    this.applicationController.setModalState(number)
  }
  Register(username: string, password: string, emailOrEducationCode: string) {
    this.applicationController.Register(username, password, emailOrEducationCode);
  }
  Login(username: string, password: string) {
    this.applicationController.Login(username, password);
  }
}
