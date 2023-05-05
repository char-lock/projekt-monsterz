import { Component } from "@angular/core";
import { LoggerService } from "src/app/services/logger.service";
import { SessionService } from "src/app/services/session.service";

@Component({
  selector: "[modalContentLogin]",
  templateUrl: "./login.modal.html",
  styleUrls: ["./login.modal.css"]
})
export class LoginModal {

  constructor(private _session: SessionService, private _logger: LoggerService) {}

  get username() {
    return (<HTMLInputElement>document.getElementById("input-username"))
      ?.value;
  }

  get password() {
    return (<HTMLInputElement>document.getElementById("input-password"))
      ?.value;
  }

  /** Sends a request to login as a user through the session service. */
  login() {
    const username = document.getElementById("input-username");
    const password = document.getElementById("input-password");

    this._logger.log("login.modal", "login", "username and password: ", { "username": username, "password": password });
    
    if (username) {
      console.log((<HTMLInputElement>username).value);
    }

    if (password) {
      console.log((<HTMLInputElement>password).value);
    }

    if (username && password) {
      console.log("true!");
      this._session.login((<HTMLInputElement>username).value, (<HTMLInputElement>password).value);
    }
  }

}
