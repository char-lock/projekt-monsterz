import { Injectable, OnInit } from "@angular/core";
import { ApiService } from "./api.service";
import { UserSessionService } from "./user-session.service";
import { UserService } from "./user.service";

@Injectable()
export class LeaderboardService {
  leaderboardGlobal: (string | number)[][] = [];
  leaderboardClass: (string | number)[][] = [];
  lastUpdated: number = -1;

  constructor(
    private apiService: ApiService,
    private userSession: UserSessionService,
    private userService: UserService
  ) { }

  GetGlobalLeaderboard() {
    if (this.lastUpdated + (900 * 1000) < Date.now()) {
      this.lastUpdated = Date.now();
      this.UpdateLeaderboard();
    }
    return this.leaderboardGlobal;
  }

  GetClassLeaderboard() {
    if (this.lastUpdated + (900 * 1000) < Date.now()) {
      this.lastUpdated = Date.now();
      this.UpdateLeaderboard();
    }
    return this.leaderboardClass.sort(this.sortArrayByScore);
  }

  UpdateLeaderboard() {
    this.apiService.GetLeaderboardGlobal((resultGlobal: (string | number)[][]) => {
      if (resultGlobal.length === 0) {
        console.log("failed to get global leaderboard");
      } else {
        this.leaderboardGlobal = resultGlobal;
        this.apiService.GetLeaderboardClass(this.userService.getClassCode(), (resultClass: (string | number)[][]) => {
          if (resultClass.length === 0) {
            console.log("Failed to get class leaderboard");
            // Handle failure to retrieve
          } else {
            this.leaderboardClass = resultClass;
          }
        });
      }
    });
  }
  sortArrayByScore(a: (string | number)[], b: (string | number)[]) {
    if (a[1] === b[1]) return 0;
    if (a[1] < b[1]) return 1;
    return -1;
  }

}

