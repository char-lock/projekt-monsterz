import { Component, OnInit } from "@angular/core";

import { CookieService } from "./services/cookie.service";
import { LoggerService } from "./services/logger.service";
import { SessionService } from "./services/session.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'projekt-monsterz-ui'

  constructor(
    private _session: SessionService,
    private _logger: LoggerService
  ) {}

  ngOnInit() {
    this._session.importFromCookie();
  }

}
