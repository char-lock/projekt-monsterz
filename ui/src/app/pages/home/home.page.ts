import { Component } from "@angular/core";
import { ToasterService } from "src/app/services/toaster.service";
import { ValidationRule } from "src/app/types/other.types";

/** A component defining the landing page for the application. */
@Component({
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.css"]
})
export class HomePage {

  inputRules: ValidationRule[] = [
    {
      check: (input: string) => { return input.trim().length > 0; },
      description: "Required"
    },
    {
      check: (input: string) => { return input.length > 2; },
      description: 'Must be greater than 2 characters in length'
    },
    {
      check: (input: string) => { return input.length < 6; },
      description: 'Must be less than 6 characters in length'
    }
  ];

  constructor(private _toaster: ToasterService) {}

  onClick() {
    this._toaster.toast("This is a test toast", "normal", 3000);
  }

}
