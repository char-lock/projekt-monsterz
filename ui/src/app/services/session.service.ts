import { Injectable } from "@angular/core";
import { Buffer } from "buffer";
import { ApiService } from "./api.service";
import { LoggerService } from "./logger.service";
import { BehaviorSubject } from "rxjs";
import { NewUser, User, UserType, ValidationMethod } from "../types/api.types";
import { CookieService } from "./cookie.service";
import { ToastService } from "./toast.service";

/** 
 * A service that handles all session-related activities, including
 * user authentication, registration, etc.
 * 
 * @class SessionService
 */
@Injectable()
export class SessionService {

  private _authToken: string = "";
  private _authTokenSubject = new BehaviorSubject<string>(this._authToken);
  get authToken() { return this._authToken; }
  get authTokenSubject() { return this._authTokenSubject; }

  private _refreshedOn = -1;
  private _startedOn = -1;

  private _user: User | undefined = undefined;
  private _userSubject = new BehaviorSubject<User | undefined>(this._user);
  get user(): User { 
    return this._user ? this._user : {
      id: -1,
      username: "",
      user_type: UserType.INDIVIDUAL,
      created_on: "-1",
      progress_lesson: 1,
      progress_content: 1,
      validated: false,
      validated_on: "-1",
      validation_method: ValidationMethod.UNKNOWN,
      validation_value: ""
    };
  }
  get userSubject() { return this._userSubject; }

  constructor(
    private _api: ApiService,
    private _cookie: CookieService,
    private _toaster: ToastService,
    private _logger: LoggerService
  ) {}

  /** Logs a message to the console from the SessionService.  */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("session.service", func, message, meta);
  }

  /** 
   * Requests a new token for the current session and sets it
   * accordingly.
   * 
   * Subscribe to the authTokenSubject with a callback to use the
   * updated results.
   * 
   * Alternatively, provide a callback if you would like to only
   * act on the results a single time.
   */
  refresh(callback?: (success: boolean) => void) {
    this._refreshedOn = Date.now();
    this._api.refreshAuthToken(this.authToken, (token) => {
      this._authToken = token;
      this._authTokenSubject.next(this._authToken);
      if (callback) callback(this._authToken !== "");
    });
  }


  /** 
   * Encodes the current session data into base64 and returns it as a
   * string for storage.
   */
  export() {
    const data = { 
      authToken: this._authToken, 
      user: this._user, 
      startedOn: this._startedOn,
      refreshedOn: this._refreshedOn
    };
    this.log(
      "export", 
      "exporting the current session to an encoded string ...",
      data
    );
    const enc = Buffer.from(JSON.stringify(data)).toString("base64");
    this.log("export", `current session encoded to "${enc}"`);
    return enc;
  }

  /** Imports session data from a base64 encoded string. */
  import(data: string) {
    this.log("import", `importing session from "${data}" ...`);
    const plaintext = Buffer.from(data, "base64").toString();
    this.log("import", `session data decoded to\n${plaintext}`);
    const session = JSON.parse(plaintext);
    if (session.authToken === undefined 
      || session.user === undefined 
      || session.startedOn === undefined 
      || session.refreshedOn === undefined) {
      return this.log("import", "invalid session data");
    }
    this._authToken = session.authToken;
    // Refresh the token regardless to ensure validity.
    this.refresh((success: boolean) => {
      // Set the rest of the data we want if the refresh succeeded.
      if (success) {
        this.log("import", "session token is valid");
        this._user = session.user;
        this._userSubject.next(this._user);
        this._startedOn = session.startedOn;
      } else {
        this.log("import", "session token invalid -- bad import");
        this.revoke();
      }
    });
  }

  /** 
   * Returns whether or not the current session is valid with a defined
   * and authenticated user.
   */
  isValid() {
    if (Date.now() > this._refreshedOn + (15 * 60 * 1000)
      && this.authToken !== ""
      && this._refreshedOn !== -1
      && this.user) {
      this.refresh();
    }
    return this._authToken !== "";
  }

  /** 
   * Exports the current session to a cookie labelled as 
   * "projekt_monsterz.session".
   */
  exportToCookie() {
    this._cookie.saveAs("projekt_monsterz.session", this.export());
  }

  /**
   * Attempts to import a session from a cookie labelled as
   * "projekt_monsterz.session".
   */
  importFromCookie() {
    this.import(this._cookie.load("projekt_monsterz.session"));
  }

  /** 
   * Clears out all of the current session data and deletes the
   * session's cookie data.
   */
  revoke() {
    this.log("revoke", "revoking the current session ...");
    this._authToken = "";
    this._authTokenSubject.next("");
    this._user = undefined;
    this._userSubject.next(undefined);
    this._startedOn = -1;
    this._refreshedOn = -1;
    this._cookie.delete("projekt_monsterz.session");
  }

  /** Attempts to register a new user with the provided details. */
  register(user: NewUser) {
    user.username = user.username.toLowerCase();
    this.log("register", "registering new user ...", user);
    this._api.registerUser(user, (registered: User | undefined) => {
      if (registered === undefined) {
        this.log("register", `failed to register as ${user.username}`);
        return this._toaster.createToast("registration failed", "error");
      }
      this.log("register", `successfully registered new user "${user.username}"`);
      this.login(user.username, user.password);
    });
  }

  /**
   * Attempts to authenticate a user using the provided credentials and
   * updates the session upon success.
   */
  login(username: string, password: string) {
    username = username.toLowerCase();
    this.log("login", `logging in as "${username}" ...`);
    this._api.getAuthToken(username, password, (token: string) => {
      if (token === "") {
        this.log("login", `failed to login as ${username}`);
        return this._toaster.createToast("login failed", "error");
      }
      this._authToken = token;
      this._authTokenSubject.next(token);
      this._startedOn = Date.now();
      this._refreshedOn = Date.now();
      this._api.getUserByUsername(username, (userData: User) => {
        this._user = userData;
        this._userSubject.next(userData);
      });
    })
  }

}
