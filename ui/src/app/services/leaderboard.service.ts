import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { SessionService } from "./session.service";
import { LoggerService } from "./logger.service";
import { LeaderboardEntry } from "../types/other.types";

/** Handles all operations related to fetching and calculating the leaderboard. */
@Injectable()
export class LeaderboardService {

  leaderboardGlobal: LeaderboardEntry[] = [];
  leaderboardClass: LeaderboardEntry[] = [];
  updatedOn: number = -1;
  updatingGlobal = false;
  updatingClass = false;

  constructor(
    private _api: ApiService,
    private _session: SessionService,
    private _logger: LoggerService
  ) {
    this._session.userSubject.subscribe((change) => {
      if (change) {
        this.update();
      }
    });
  }

  log(func: string, message: string, meta?: any) {
    this._logger.log("leaderboard.service", func, message, meta);
  }

  get needUpdate() {
    return (
      Date.now() >= this.updatedOn + (15 * 60 * 1000) 
      && this.updatedOn !== -1
    );
  }

  leaderboard(global: boolean) {
    if (this.needUpdate) {
      this.update();
    }
    return global ? this.leaderboardGlobal : this.leaderboardClass;
  }

  /** @deprecated Prefer `leaderboard()` */
  GetGlobalLeaderboard() { return this.leaderboard(true); }
  /** @deprecated Prefer `leaderboard()` */
  GetClassLeaderboard() { return this.leaderboard(false); }

  update() {
    this.updatedOn = Date.now();
    if (!this.updatingGlobal && this._session.isValid()) {
      this.updatingGlobal = true;
      this.leaderboardGlobal = [];
      this._api.getUsersByScore(5, (users) => {
        this._api.getUserScores(users, (score) => { 
          this.leaderboardGlobal.push(score); 
          if (this.leaderboardGlobal.length === users.length) { 
            this.updatingGlobal = false; 
          }
        });
      });
    }
    if (!this.updatingClass && this._session.isValid()) {
      this.updatingClass = true;
      this.leaderboardClass = [];
      this._api.getClassUsersByScore(
        this._session.user.validation_value, 
        5, 
        (users) => {
          this._api.getUserScores(users, (score) => { 
            this.leaderboardClass.push(score); 
            if (this.leaderboardClass.length === users.length) { 
              this.updatingGlobal = false; 
            }
          });
      });
    }
  }

}
