import { Component, Input, DoCheck, Output, EventEmitter } from "@angular/core";
import { LoggerService } from "src/app/services/logger.service";
import { ValidationRule } from "src/app/types/other.types";

/** 
 * A generic input component for FangUI.
 * 
 * @class FangInputComponent
 */
@Component({
  selector: "fang-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"]
})
export class FangInputComponent implements DoCheck {

  /** Placeholder text for the input. */
  @Input() placeholder: string = "Type your response here ...";

  /** Location for a target icon after compilation.  */
  @Input() iconUrl: string = "";

  /** A list of rules with which the input must comply. */
  @Input() validationRules: ValidationRule[] = [];

  private _trueType: "unset" | "text" | "password" = "unset"; // An internal value to track what the original type is.
  get trueType() { return this._trueType; } // Required for checking if we need to show the visibility toggle.
  /** Whether this input contains plaintext or a password. */
  @Input() 
  get type(): "text" | "password" {
    // Regardless of any other setting, if the password is meant to be
    // visible, the input element should have the type of text.
    if (this._isPasswordVisible) return "text";
    return this._trueType !== "unset" ? this._trueType : "text";
  }
  set type(value: "text" | "password") {
    // If an input type has already been established for this component,
    // we don't want to alter it.
    if (this._trueType !== "unset") return;
    this._trueType = value;
  }

  /** An identifier used for both the id and the name of the input element. */
  @Input() id: string = this._generateUniqueId();

  private _everFocused = false;
  /** Whether or not this input has ever had the user's focus. */
  get everFocused() { return this._everFocused; }

  private _isPasswordVisible = false;
  /** Whether the password has been toggled so that the user can view it. */
  get isPasswordVisible() { return this._isPasswordVisible; }

  /** The text written to the input element at any given moment. */
  public inputValue: string = "";
  /** The value written to the input element prior to the current update. */
  private _lastKnownValue: string = "";

  /** A list of all classes that should be applied to the input element. */
  public inputClasses: string[] = ["fang_input--input"];

  constructor(private _logger: LoggerService) { }

  /** Writes a log to the console as the InputComponent */
  private log(func: string, message: string, meta?: any): void {
    this._logger.log(`input.component[${this.id}]`, func, message, meta);
  }

  /** 
   * An event hook that runs any time that something is updated, including
   * events not caught by the OnChanges hook.
   */
  public ngDoCheck(): void {
    if (this.inputValue !== this._lastKnownValue) {
      this.log(
        "ngDoCheck", 
        `A change has been detected for this input component:\n`
        + `(previous value): "${this._lastKnownValue}"\n`
        + `(updated value): "${this.inputValue}"`
      );
      this._onInputChange();
      this._lastKnownValue = this.inputValue;
    }
  }

  /** Generates a unique alphanumeric ID for the input element. */
  private _generateUniqueId(): string {
    const idLength = 12;
    const availableCharacters = [
      "abcdefghijklmnopqrstuvwxyz",
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "01234576789"
    ].join();
    let id = 'fang-input-';
    for (let i = 0; i < idLength; i++) {
      const charIndex = Math.floor(Math.random() * availableCharacters.length);
      id += availableCharacters.charAt(charIndex);      
    }
    if (document.getElementById(id) !== null) id = this._generateUniqueId();
    return id;
  }

  /** 
   * Processes internal state data and updates properties based upon 
   * the new value entered into the input element.
   */
  private _onInputChange(): void {
    // If any character has been typed into the input element, then we
    // want to mark that this particular component has had the user's
    // focus at least once.
    if (this.inputValue !== "") this._everFocused = true;
    // Now, we want to see if we even need to check the validation rules.
    if (!this._everFocused || this.validationRules.length === 0) {
      this.inputClasses = ["fang_input--input"];
      return this.log(
        "_onInputChange", 
        "This input element has never been focused by the user; "
        + "ensuring classes are set to the neutral value ..."
      );
    }
    // With that, we need to iterate through each of the rules and ensure
    // that the current input passes through them; we'll set the input
    // element's classes accordingly, either way.
    let inputIsValid: boolean = true;
    this.validationRules.forEach((rule: ValidationRule) => {
      if (rule.check(this.inputValue)) {
        this.log(
          "_onInputChange", 
          `Passed validation rule: "${rule.description}"`
        );
      } else {
        this.log(
          "_onInputChange",
          `Failed validation rule: "${rule.description}"`
        );
        inputIsValid = false;
      }
    });
    this.inputClasses = inputIsValid 
      ? ["fang_input--input", "valid"] 
      : ["fang_input--input", "invalid"];
    // Finally, we'll update our last known value and send the value
    // out through the emitter.
    this.value.next(this.inputValue);
  }

  /** 
   * Returns a list containing applicable classes for an icon used
   * by the input component.
   */
  public getIconClasses(): string[] {
    // If the input element has never had the user's focus, we only want
    // the icon to be styled neutrally.
    if (!this._everFocused) return ["fang_input--icon"];
    // Otherwise, we'll check to see if the input is styled a certain way.
    const iconClasses: string[] = ["fang_input--icon"];
    if (this.inputClasses.includes("valid")) {
      iconClasses.push("valid");
    } else if (this.inputClasses.includes("invalid")) {
      iconClasses.push("invalid");
    }
    return iconClasses;
  }

  /** 
   * Returns a list containing the applicable classes for the provided
   * rule, based upon whether or not the input passes.
   */
  public getRuleClasses(rule: ValidationRule): string[] {
    // If the input element has never had the user's focus, we only want
    // the rule to be styled neutrally.
    if (!this._everFocused) return ["fang_input--rule"];
    // Otherwise, we need to run the rule's validation function.
    return rule.check(this.inputValue) 
      ? ["fang_input--rule", "valid"] 
      : ["fang_input--rule", "invalid"];
  }

  /** 
   * Toggles whether or not the value for an input with a "password"
   * type should be visible to the user.
   */
  public toggleVisibility(): void { 
    this._isPasswordVisible = !this._isPasswordVisible; 
  }

  /** 
   * Allows external components to access the current value of the 
   * input element.
   */
  @Output() value: EventEmitter<string> = new EventEmitter();

}
