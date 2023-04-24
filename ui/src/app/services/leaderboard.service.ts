import { Injectable, OnInit } from "@angular/core";
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
  lastUpdated: number = -1;

  constructor(
    private apiService: ApiService,
    private userSession: UserSessionService,
    private userService: UserService,
    private logger: LoggerService
  ) {}

  GetGlobalLeaderboard() {
    if (this.lastUpdated + (15 * 60 * 1000) < Date.now()) {
      this.lastUpdated = Date.now();
      this.updateLeaderboard();
    }
    return this.leaderboardGlobal;
  }

  GetClassLeaderboard() {
    if (this.lastUpdated + (15 * 60 * 1000) < Date.now()) {
      this.lastUpdated = Date.now();
      this.updateLeaderboard();
    }
    return this.leaderboardClass;
  }

  /** Calculates leaderboard entries and inserts them */
  parseUsersToPercent(users: User[], global: boolean = true) {
    if (global) {
      this.leaderboardGlobal = [];
    } else {
      this.leaderboardClass = [];
    }
    users.forEach((user) => {
      this.apiService.getLessonMeta(user.progress_lesson + 1)
        .then((lessonMetadata) => {
          if (lessonMetadata === undefined) {
            return this.logger.makeLog("leaderboard.service::parseUsersToScore", "failed to get lesson metadata");
          }
          this.apiService.getContentMeta(user.progress_content + 1)
            .then((contentMetadata) => {
              if (contentMetadata === undefined) {
                return this.logger.makeLog("leaderboard.service::parseUsersToScore", "failed to get content metadata");
              }
              this.apiService.getUnitMeta(lessonMetadata.unit_id)
                .then((unitMetadata) => {
                  if (unitMetadata === undefined ){
                    return this.logger.makeLog("leaderboard.service::parseUsersToScore", "failed to get unit metadata");
                  }
                  const unitProgress = (lessonMetadata.position - 1) / unitMetadata.lesson_count;
                  const singleLesson = 1 / unitMetadata.lesson_count;
                  let lessonProgress = contentMetadata.position / lessonMetadata.content_count;
                  lessonProgress *= singleLesson;
                  const entry: LeaderboardEntry = {
                    username: user.username,
                    percent: unitProgress + lessonProgress,
                    score: Math.floor((unitProgress + lessonProgress) * 10000)
                  };
                  if (global) {
                    this.leaderboardGlobal.push(entry);
                  } else {
                    this.leaderboardClass.push(entry);
                  }
                });
            });
        });
    });
  }

  /** Updates the current scores within the leaderboard. */
  updateLeaderboard() {
    this.apiService.getUsersByScore(5)
      .then((resultGlobal) => {
        if (resultGlobal.length === 0) {
          this.logger.makeLog("leaderboard.service::updateLeaderboard", "failed to retrieve global leaderboard");
        } else {
          this.parseUsersToPercent(resultGlobal, true);
          const educationCode = this.userService.getClassCode();
          this.apiService.getClassUsersByScore(educationCode, 5)
            .then((resultClass) => {
              if (resultClass.length === 0) {
                this.logger.makeLog("leaderboard.service::updateLeaderboard", "failed to retrieve class leaderboard");
              } else {
                this.parseUsersToPercent(resultClass, false);
              }
            })
            .catch((rejectClass) => {
              this.logger.makeLog("leaderboard.service::updateLeaderboard", JSON.stringify(rejectClass));
            })
        }
      })
      .catch((rejectGlobal) => {
        this.logger.makeLog("leaderboard.service::updateLeaderboard", JSON.stringify(rejectGlobal));
      });
  }

}

