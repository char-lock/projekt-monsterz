import { Component, OnInit } from "@angular/core";

import { CookieService } from "./services/cookie.service";
import { LoggerService } from "./services/logger.service";
import { SessionService } from "./services/session.service";
import { NavLink } from "./types/other.types";
import { ModalService } from "./services/modal.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'projekt-monsterz-ui'

  appRoutes: NavLink[] = [
    { 
      label: "Dashboard",
      location: "/dashboard", 
      displayCheck: () => { return this._session.isValid(); } 
    },
    {
      label: "Login",
      onClick: () => { this._modal.create("login"); },
      displayCheck: () => { return !this._session.isValid(); }
    },
    {
      label: "Logout",
      onClick: () => { this._session.revoke(); },
      displayCheck: () => { return this._session.isValid(); }
    }
  ];

  constructor(
    private _session: SessionService,
    private _modal: ModalService,
    private _logger: LoggerService
  ) {}

  ngOnInit() {
    this._session.importFromCookie();
  }

}
