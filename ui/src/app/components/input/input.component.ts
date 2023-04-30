import { Component, Input, DoCheck } from "@angular/core";
import { LoggerService } from "src/app/services/logger.service";
import { ValidationRule } from "src/app/types/other.types";

@Component({
  selector: "pm-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"]
})
export class InputComponent implements DoCheck {

  @Input() placeholder: string = "Type your response here ...";
  @Input() iconUrl: string = "";
  @Input() validationRules: ValidationRule[] = [];
  @Input() type: "password" | "text" = "text";
  @Input() id: string = this.generateUniqueId();

  hasBeenFocused = false;
  passwordShown = false;
  inputRef: string = "";
  prevInput: string = "";

  constructor(private _logger: LoggerService) {
  }

  /** Writes a log to the console as the InputComponent */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("input.component", func, message, meta);
  }

  ngDoCheck() {
    if (this.inputRef !== this.prevInput) {
      this.validate();
    }
  }

  /** Generates a unique alphanumeric ID for the input element. */
  private generateUniqueId() {
    const idLength = 12;
    const availableCharacters = [
      "abcdefghijklmnopqrstuvwxyz",
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "01234576789"
    ].join();
    let id = 'pm-input-';
    for (let i = 0; i < idLength; i++) {
      const charIndex = Math.floor(Math.random() * availableCharacters.length);
      id += availableCharacters.charAt(charIndex);      
    }
    if (document.getElementById(id) !== null) id = this.generateUniqueId();
    return id;
  }

  /** Returns the result of the provided rule's check. */
  checkRule(rule: ValidationRule) {
    return rule.check(this.inputRef);
  }

  /** Returns whether or not all rules are passed by the current input. */
  validate() {
    if (this.inputRef !== "") this.hasBeenFocused = true;
    let isValid = true;
    this.validationRules.forEach((rule) => {
      if (!rule.check(this.inputRef)) {
        isValid = false;
      }
    });
    this.log("validate", `input with id ${this.id} is ${isValid ? 'valid' : 'invalid'}`);
    return isValid;
  }

}