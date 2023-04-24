import { Request, Response } from "express";

import { ApiResponse } from "../../shared/api.response";

import UsersData from "../users/users.data";
import ApiLogger from "../../shared/logger";

export default class LeaderboardController {

  static defaultLogger = new ApiLogger("leaderboard.controller");

  static getGlobalLeaderboardUsers(req: Request, rawResponse: Response) {
    const res = new ApiResponse(rawResponse);
    const userCount = parseInt(req.params.count);
    const logger = LeaderboardController.defaultLogger
      .createFunctionLogger("getGlobalLeaderboard");
    logger.debug(`received request: get ${userCount} users sorted by score`);
    UsersData.getUsersByScore(userCount)
      .then((users) => {
        if (users.length === 0) {
          logger.debug(`no users found in database`);
          return res.status(404).describe("no users found").send();
        }
        return res.send(users);
      })
      .catch((reject) => {
        logger.error("unhandled exception occurred");
        logger.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getClassLeaderboardUsers(req: Request, rawResponse: Response) {
    const res = new ApiResponse(rawResponse);
    const userCount = parseInt(req.params.count);
    const educationCode = req.params.educationCode;
    const logger = LeaderboardController.defaultLogger
      .createFunctionLogger("getGlobalLeaderboard");
    logger.debug(`received request: get ${userCount} users sorted by score`);
    UsersData.getClassUsersByScore(educationCode, userCount)
      .then((users) => {
        if (users.length === 0) {
          logger.debug(`no users found in database`);
          return res.status(404).describe("no users found").send();
        }
        return res.send(users);
      })
      .catch((reject) => {
        logger.error("unhandled exception occurred");
        logger.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

}
