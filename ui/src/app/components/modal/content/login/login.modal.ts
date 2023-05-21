import { Component } from "@angular/core";
import { LoggerService } from "src/app/services/logger.service";
import { SessionService } from "src/app/services/session.service";
import { ToasterService } from "src/app/services/toaster.service";

@Component({
  selector: "[modalContentLogin]",
  templateUrl: "./login.modal.html",
  styleUrls: ["./login.modal.scss"]
})
export class LoginModal {

  private _usernameValue: string = "";
  private _passwordValue: string = "";

  constructor(
    private _session: SessionService, 
    private _toaster: ToasterService,
    private _logger: LoggerService
  ) {}

  public onUsernameChange(username: string): void {
    this._usernameValue = username;
  }

  public onPasswordChange(password: string): void {
    this._passwordValue = password;
  }

  /** Sends a request to login as a user through the session service. */
  public login(): void {
    if (this._usernameValue.trim() === "" || this._passwordValue.trim() === "") {
      return this._toaster.toast("Oops! You need to type a username and a password!", "warning", 3500, "Try Again!");
    }
    this._session.login(this._usernameValue, this._passwordValue);
  }

}
