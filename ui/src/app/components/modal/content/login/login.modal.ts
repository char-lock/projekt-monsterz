import { Component } from "@angular/core";
import { SessionService } from "src/app/services/session.service";

@Component({
  selector: "[modalContentLogin]",
  templateUrl: "./login.modal.html",
  styleUrls: ["./login.modal.css"]
})
export class LoginModal {

  constructor(private _session: SessionService) {}

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
    this._session.login(this.username, this.password);
  }

}
