import { Component } from "@angular/core";
import { LoggerService } from "src/app/services/logger.service";
import { SessionService } from "src/app/services/session.service";
import { ToasterService } from "src/app/services/toaster.service";
import { ValidationMethod } from "src/app/types/api.types";
import { ValidationRule } from "src/app/types/other.types";

@Component({
  selector: "[modalContentRegister]",
  templateUrl: "./register.modal.html",
  styleUrls: ["./register.modal.scss"]
})
export class RegisterModal {

  private _usernameValue: string = "";
  private _passwordValue: string = "";
  private _verificationValue: string = "";

  public usernameValidationRules: ValidationRule[] = [
    {
      description: "Must start with a letter",
      check: (username: string) => {
        return /^[a-zA-Z].*$/.test(username);
      }
    },
    {
      description: "Use only letters or numbers",
      check: (username: string) => {
        return /^[a-zA-Z0-9]+$/.test(username);
      }
    },
    {
      description: "At least 6 characters",
      check: (username: string) => {
        return username.length >= 6;
      }
    }
  ];

  public passwordValidationRules: ValidationRule[] = [
    {
      description: "At least 8 characters",
      check: (password: string) => {
        return password.length >= 8
      }
    },
    {
      description: "Contains a capital letter",
      check: (password: string) => {
        return /.*[A-Z].*/.test(password);
      }
    },
    {
      description: "Contains a number",
      check: (password: string) => {
        return /.*[0-9].*/.test(password);
      }
    },
    {
      description: "Contains a special character (!@#$%^&*._+-/\\)",
      check: (password: string) => {
        return /.*[!@#$%^&*._+-/\\].*/.test(password);
      }
    }
  ];

  public verificationValidationRules: ValidationRule[] = [
    {
      description: "Valid email address or education code",
      check: (verify: string) => {
        const email =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(verify);
        const educode = /^[a-zA-Z]+$/.test(verify) && verify.length === 6;
        return email || educode;
      }
    }
  ];

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

  public onVerificationChange(verification: string): void {
    this._verificationValue = verification;
  }

  private _validateInput(): boolean {
    let valid = true;
    this.usernameValidationRules.forEach((rule) => {
      if (!rule.check(this._usernameValue)) {
        valid = false;
      }
    });
    this.passwordValidationRules.forEach((rule) => {
      if (!rule.check(this._passwordValue)) {
        valid = false;
      }
    });
    this.verificationValidationRules.forEach((rule) => {
      if (!rule.check(this._verificationValue)) {
        valid = false;
      }
    });
    return valid;
  }

  public register(): void {
    if (!this._validateInput()) {
      return this._toaster.toast("Check your input and try again!", "failure", 3500, "Invalid Values");
    }
    this._session.register({
      username: this._usernameValue,
      password: this._passwordValue,
      validation_method: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this._verificationValue) 
        ? ValidationMethod.EMAIL
        : ValidationMethod.EDUCATION_CODE,
      validation_value: this._verificationValue
    });
  }

}
