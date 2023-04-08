import { Component, OnInit } from '@angular/core';

import { CookieService } from 'ngx-cookie-service'
import { ApplicationStateService } from './services/application-state.service';
import { LoggerService } from './services/logger.service';
import { UserSessionService } from './services/user-session.service';
import { UserSession } from './types/UserSession';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'projekt-monsterz-front'
  constructor(
    private logger: LoggerService,
    private cookieService: CookieService,
    private userSession: UserSessionService,
    private appState: ApplicationStateService
  ) { }

  ngOnInit() {
    if (this.cookieService.get("projekt-monsterz.session") !== "") {
      const previousSession: UserSession = JSON.parse(this.cookieService.get("projekt-monsterz.session"));
      this.userSession.LoadSession(previousSession);
      this.logger.makeLog("app.component", "loaded user session from cookie");
    }
  }
}
