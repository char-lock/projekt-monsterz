import { Component, DoCheck, EventEmitter, Input, Output } from "@angular/core";

import { LoggerService } from "src/app/services/logger.service";
import { ValidationRule } from "src/app/types/other.types";

@Component({
  selector: "fang-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"]
})
export class FangInputComponent implements DoCheck {

  /** Default value for the input field element */
  @Input() defaultValue: string = "";
  /** Placeholder text for the input field element */
  @Input() placeholder: string = "Type response here ...";

  /** Whether or not this input is required. */
  @Input() required: boolean = false;

  @Input() validationRules: ValidationRule[] = [];
  private get _shouldValidate(): boolean {
    return this.required || this.validationRules.length > 0;
  }

  /** After-build location of the target icon */
  @Input() iconUrl: string = "";
  /** Whether or not an icon should be displayed */
  public get displayIcon(): boolean { 
    return this.iconUrl.trim().length > 0;
  }

  private _isPasswordVisible = false;
  /** Whether the password has been toggled so that the user can view it. */
  get isPasswordVisible() { return this._isPasswordVisible; }

  // An internal value to track what the original type is.
  private _trueType: "unset" | "text" | "password" = "unset";
  // Required for checking if we need to show the visibility toggle.
  get trueType() { return this._trueType; }
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

  @Input() id: string = this._generateUniqueId();

  // Internal property to track if the input element has ever been focused
  private _everFocused: boolean = false;
  // Internal property to track if the value of the input element has ever changed
  private _everChanged: boolean = false;
  // Internal property to track if the user is currently changing the input
  private _userChangeStarted: boolean = false;

  /** The text written to the input element at any given moment. */
  public currentValue: string = this.defaultValue;
  /** The value written to the input element prior to the current update. */
  private _previousValue: string = "";

  /** Event emitted when the user starts to change the input value */
  @Output() userChangeStart: EventEmitter<string> = new EventEmitter();
  /** Event emitted when the user changes the input value */
  @Output() userChange: EventEmitter<string> = new EventEmitter();
  /** Event emitted when the user stops changing the input value */
  @Output() userChangeEnd: EventEmitter<string> = new EventEmitter();

  // Tailwind classes to use for varying input states
  private _sharedClasses: string[] = [
    "fang-input__input",
    "rounded",
    "py-2",
    "border-b-2", "border-b-transparent",
    "focus:outline-none",
  ]
  @Input() defaultClasses: string[] = [
    "bg-slate-100", "dark:bg-slate-900",
    "text-slate-600", "dark:text-slate-400",
    "placeholder:text-slate-400", "dark:placeholder:text-slate-600",
    "focus:border-b-slate-400", "dark:focus:border-b-slate-600"
  ];
  @Input() invalidClasses: string[] = [
    "bg-red-100", "dark:bg-red-950",
    "text-red-600", "dark:text-red-500",
    "placeholder:text-red-400", "dark:placeholder:text-red-700",
    "focus:border-b-red-400", "dark:focus:border-b-red-700"
  ];
  @Input() validClasses: string[] = [
    "bg-green-100", "dark:bg-green-900",
    "text-green-600", "dark:text-green-400",
    "placeholder:text-green-400", "dark:placeholder:text-green-600",
    "focus:border-b-green-400", "dark:focus:border-b-green-600"
  ];
  public get currentClasses(): string  {
    let classes: string[] = this._sharedClasses;
    if ((this._shouldValidate && this._everChanged) || (this.required && this._everFocused)) {
      classes = classes.concat(
        this._validate() 
          ? this.validClasses 
          : this.invalidClasses
        );
    } else {
      classes = classes.concat(this.defaultClasses);
    }
    if (this.displayIcon) classes.push("il");
    if (this._trueType === "password") classes.push("ir");
    return classes.join(" ");
  }

  /** CSS classes to use for the icons displayed */
  public get iconClasses(): string {
    const classes: string[] = ["fang-input__icon"]
    if ((this._shouldValidate && this._everChanged) || (this.required && this._everFocused)) {
      classes.push(this._validate() ? "bg-green-600" : "bg-red-600");
      classes.push(this._validate() ? "dark:bg-green-400" : "dark:bg-red-500");
    } else {
      classes.push("bg-slate-600 dark:bg-slate-400");
    }
    return classes.join(" ");
  }

  constructor(private _logger: LoggerService) {}

  /** Writes a log to the console as the InputComponent */
  private log(func: string, message: string, meta?: any): void {
    this._logger.log(`input.component[${this.id}]`, func, message, meta);
  }

  /** 
   * An event hook that runs any time that something is updated, including
   * events not caught by the OnChanges hook.
   */
  public ngDoCheck(): void {
    if (this.currentValue !== this._previousValue) {
      this.log(
        "ngDoCheck", 
        `A change has been detected for this input component:\n`
        + `(previous value): "${this._previousValue}"\n`
        + `(updated value): "${this.currentValue}"`
      );
      this._onInputChange();
      this._previousValue = this.currentValue;
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

  public onBlur(): void {
    if (!this._everFocused) this._everFocused = true;
    if (this._userChangeStarted) {
      this._userChangeStarted = false;
      this.userChangeEnd.emit(this.currentValue);
    }
  }

  /** Returns whether or not the input value should be considered valid */
  private _validate(): boolean {
    if (!this._shouldValidate) return true;
    if (this.currentValue.trim() === "" && this.required && this._everFocused) return false;
    let valid: boolean = true;
    for (let i = 0; i < this.validationRules.length; i++) {
      if (!this.validationRules[i].check(this.currentValue)) {
        valid = false;
        break;
      }
    }
    return valid;
  }

  private _onInputChange(): void {
    if (!this._userChangeStarted) {
      if (!this._everChanged) this._everChanged = true;
      this._userChangeStarted = true;
      this.userChangeStart.emit(this.currentValue);
    }
    this.userChange.emit(this.currentValue);
  }

  public toggleVisibility(): void {
    this._isPasswordVisible = !this._isPasswordVisible;
  }

  public getRuleClasses(rule: ValidationRule): string {
    if (!this._everChanged) return "";
    if (rule.check(this.currentValue)) {
      return "text-green-600 dark:text-green-400";
    }
    return "text-red-600 dark:text-red-500";
  }

}
