import { Component } from "@angular/core";
import { LoggerService } from "src/app/services/logger.service";
import { ModalService } from "src/app/services/modal.service";
import { SessionService } from "src/app/services/session.service";
import { ToastService } from "src/app/services/toast.service";
import { ValidationService } from "src/app/services/validation.service";
import { ValidationMethod } from "src/app/types/api.types";

@Component({
  selector: "[content=\"login\"]",
  templateUrl: "./login.modal.html",
  styleUrls: ["./login.modal.css"]
})
export class LoginModal {

  constructor(private _session: SessionService) {}

  /** Sends a request to login as a user through the session service. */
  login(username: string, password: string) {
    this._session.login(username, password);
  }

}
