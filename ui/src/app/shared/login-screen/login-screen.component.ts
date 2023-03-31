import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { EmailValidationService } from '../../services/email-validation.service';
import { LoggerService } from '../../services/logger.service';

import { User } from 'src/app/types/User';
import { ApplicationStateService } from 'src/app/services/application-state.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {
  @Output() newContentChangeEvent = new EventEmitter<string>();

  constructor(
    private emailValidationService: EmailValidationService,
    private logger: LoggerService,
    private userRegistration: UserRegistrationService,
    private appState: ApplicationStateService,
    private userSession: UserSessionService,
    private router: Router
  ) {}

  ngOnInit() {
    window.onclick = ($event) => {
      if ($event.target instanceof HTMLElement) {
        if(
          $event.target.closest(".login-modal-container") === null
          && this.IsOpen()
          && !$event.target.classList.contains("arcade-btn")
          && !$event.target.classList.contains("nav-item")
        ) {
          this.Close();
        }
      }
    }

    document.onkeydown = ($event) => {
      const key = $event.key;
      if (key === "Enter") {
        if (this.IsLoginMode()) {
          document.getElementById("login-btn")?.click();
        } else if (this.IsRegistrationMode()) {
          document.getElementById("register-btn")?.click();
        }
      }
    }
  }

  IsOpen() {
    return this.appState.GetLoginModalState() > 0;
  }

  OpenToLogin() {
    this.appState.SetLoginModalState(1);
  }

  OpenToRegister() {
    this.appState.SetLoginModalState(2);
  }

  IsRegistrationMode() {
    return this.appState.GetLoginModalState() === 2;
  }

  IsLoginMode() {
    return this.appState.GetLoginModalState() === 1;
  }

  Close() {
    this.appState.SetLoginModalState(0);
    this.logger.makeLog("component.login-screen", "Closed login screen");
  }

  Register(username: string, password: string, emailOrEducationCode: string) {
    const newUser: User = {
      username: username,
      auth_key: password,
      user_type: 1,
      verification_method: 1,
      verification_value: emailOrEducationCode,
      lesson_current: 0,
      lesson_current_progress: 0,
      verified: false
    }
    this.userRegistration.AttemptRegistration(newUser, (success: boolean) => {
      if (success) {
        this.Close();
        this.router.navigate(["../dashboard"]);
      } else {
        // TODO: Handle registration failure
      }
    });
    this.logger.makeLog("component.login-screen", "Requested a registration attempt.");
  }

  Login(username: string, password: string) {
    this.userSession.LoginAs(username, password, (success: boolean) => {
      if (success) {
        this.Close();
        this.router.navigate(["../dashboard"]);
      } else {
        // TODO: Handle login failure
      }
    });
  }

}
