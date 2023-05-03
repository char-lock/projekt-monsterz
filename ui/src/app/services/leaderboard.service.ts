import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { SessionService } from "./session.service";
import { LoggerService } from "./logger.service";
import { LeaderboardEntry } from "../types/other.types";

/** 
 * A service that handles all operations related to fetching and
 * calculating the leaderboard. 
 * 
 * @class LeaderboardService
 * */
@Injectable()
export class LeaderboardService {

  /** 
   * (Read-only)
   * Whether or not the leaderboards need to be updated. 
   */
  get needsUpdate() { 
    return Date.now() >= this._lastUpdatedOn + (15 * 60 * 1000)
      && this._lastUpdatedOn !== -1;
  }

  // Internal dictionary for storing the current leaderboard.
  private _leaderboard: { [key: string]: LeaderboardEntry[] } = {
    "global": [],
    "class": []
  }
  /** 
   * Returns a list of LeaderboardEntry objects based upon which
   * leaderboard is indicated via a boolean.
   * 
   * @param global - True returns the global leaderboard;
   * False returns the class leaderboard.
   */
  public leaderboard(global: boolean) {
    if (this.needsUpdate) this.update();
    return global 
      ? this._leaderboard["global"] 
      : this._leaderboard["class"];
  }

  // Internal property to track when the leaderboard was last updated.
  private _lastUpdatedOn: number = -1;

  // Internal properties to track if an update is currently in 
  // progress.
  private _globalUpdateInProgress = false;
  private _classUpdateInProgress = false;

  constructor(
    private _api: ApiService,
    private _session: SessionService,
    private _logger: LoggerService
  ) {
    // Subscribes to the session's user observable to ensure that the
    // leaderboard does not attempt to update until a session has
    // properly begun.
    this._session.userSubject.subscribe((change) => {
      if (change) this.update();
    });
  }

  /** 
   * Writes a log to the console as the leaderboard service. 
   * 
   * @param func Name of the originating function
   * 
   * @param message Content of the log
   * 
   * @param meta (Optional) Any additional data or information to log 
   */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("leaderboard.service", func, message, meta);
  }

  /** Updates both leaderboards with the most current top scores. */
  public update(): void {
    this.log("update", "Updating the leaderboard ...");
    this._lastUpdatedOn = Date.now();
    this._updateGlobal();
    this._updateClass();
  }

  /** Updates the global leaderboard. */
  private _updateGlobal(): void {
    this.log("_updateGlobal", "Updating the global leaderboard ...");
    if (!this._globalUpdateInProgress && this._session.isValid()) {
      this._globalUpdateInProgress = true;
      const leaderboardBuffer: LeaderboardEntry[] = [];
      this._api.getUsersByScore(5, (users) => {
        this._api.getUserScores(users, (score) => { 
          leaderboardBuffer.push(score); 
          if (leaderboardBuffer.length === users.length) {
            this.log(
              "_updateGlobal", 
              "Global leaderboard has finished its update."
            );
            this._leaderboard["global"] = leaderboardBuffer;
            this._globalUpdateInProgress = false;
          }
        });
      });
    }
  }

  /** Updates the class leaderboard. */
  private _updateClass(): void {
    this.log("_updateClass", "Updating the class leaderboard ...");
    if (!this._classUpdateInProgress && this._session.isValid()) {
      this._classUpdateInProgress = true;
      const leaderboardBuffer: LeaderboardEntry[] = [];
      this._api.getClassUsersByScore(
        this._session.user.validation_value, 
        5, 
        (users) => {
          this._api.getUserScores(users, (score) => { 
            leaderboardBuffer.push(score); 
            if (leaderboardBuffer.length === users.length) { 
              this.log(
                "_updateClass", 
                "Class leaderboard has finished its update."
              );
              this._leaderboard["class"] = leaderboardBuffer;
              this._classUpdateInProgress = false; 
            }
          });
      });
    }
  }

}
