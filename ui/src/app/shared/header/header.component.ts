import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from "@angular/router";
import { ApplicationStateService } from 'src/app/services/application-state.service';

import { UserSessionService } from 'src/app/services/user-session.service';
import { CookieController } from '../../services/cookie.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  @Output() newContentChangeEvent = new EventEmitter<string>();
  currentLogin: boolean = false;
  
  constructor(
    private logger: LoggerService,
    private userSession: UserSessionService,
    private appState: ApplicationStateService,
    private router: Router
  ) {}
  
  ngOnInit() {}

  IsLoginModalOpen() {
    return this.appState.GetLoginModalState() > 0 && !this.userSession.IsAuthenticated();
  }

  IsLoggedIn() {
    return this.userSession.IsAuthenticated();
  }
  
  OpenLoginModal() {
    return this.appState.SetLoginModalState(1);
  }

  Logout() {
    this.logger.makeLog("header.component", "logged user out");
    this.userSession.RevokeSession();
    this.router.navigate([".."]);
  }
}
