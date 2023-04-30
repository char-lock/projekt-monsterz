import { Component, ElementRef, Input, ViewChild, OnChanges, SimpleChanges} from "@angular/core";
import { ValidationRule } from "src/app/types/other.types";

@Component({
  selector: "pm-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"]
})
export class InputComponent {

  @Input() placeholder: string = "Type your response here ...";
  @Input() iconUrl: string = "";
  @Input() validationRules: ValidationRule[] = [];
  @Input() type: "password" | "text" = "text";

  inputClass = "pm-input__input";

  @ViewChild('inputValue') inputValue?: ElementRef<HTMLInputElement>;

  showingPassword: boolean = false;

  constructor() {}

  updateClasses(value: Event) {
    const currentValue = (<HTMLInputElement>value.target).value;
    let isValid = true;
    this.validationRules.forEach((rule) => {
      if (!rule.check(currentValue)) {
        isValid = false;
      }
    });
    this.inputClass = isValid ? "pm-input__input valid" : "pm-input__input invalid";
  }

  showPassword() {}

  hidePassword() {}

}