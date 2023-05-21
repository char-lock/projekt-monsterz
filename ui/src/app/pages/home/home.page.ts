import { Component } from "@angular/core";
import { ModalService } from "src/app/services/modal.service";
import { ToasterService } from "src/app/services/toaster.service";
import { ValidationRule } from "src/app/types/other.types";

/** A component defining the landing page for the application. */
@Component({
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage {

  constructor(
    private _modal: ModalService
  ) {}

  public openRegistration(): void {
    this._modal.show("register");  
  }

}
