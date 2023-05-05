import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { UserSessionService } from "./user-session.service";
import { UserService } from "./user.service";
import { LoggerService } from "./logger.service";
import { User } from "../types/api.types";
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
    private _session: UserSessionService,
    private _user: UserService,
    private _logger: LoggerService
  ) {
    this._user.user.subscribe((change) => {
      if (change) {
        this.update();
      }
    })
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
    if (!this.updatingGlobal) {
      this.updatingGlobal = true;
      this.leaderboardGlobal = [];
      this._api.getUsersByScore(5, (users) => {
        this._api.getUserScores(
          users.filter((a) => {
            if (a.username === this._user.getCurrentUsername()) {
              a.username = 'YOU'
            }
            return a;
          }),
          (score) => {
            this.leaderboardGlobal.push(score);
            if (this.leaderboardGlobal.length === users.length) { this.updatingGlobal = false; }
          });
      });
    }
    if (!this.updatingClass) {
      this.updatingClass = true;
      this.leaderboardClass = [];
      this._api.getClassUsersByScore(this._user.getClassCode(), 5, (users) => {
        this._api.getUserScores(users.filter((a) =>
          a.username !== this._user.getCurrentUsername()),
          (score) => { this.leaderboardClass.push(score); if (this.leaderboardClass.length === users.length) { this.updatingGlobal = false; } });
      });
    }
  }
}
