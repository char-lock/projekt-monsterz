import { Router } from "express";
import { ApiResponse } from "../../shared/api.response";

import LeaderboardController from "./leaderboard.controller";

const router = Router();

router.get("/", (_, res) => {
  (new ApiResponse(res)).send("leaderboard endpoint");
});

router.get("/:count([0-9]+)", LeaderboardController.getGlobalLeaderboardUsers);

router.get("/class/:educationCode/:count([0-9]+)", LeaderboardController.getClassLeaderboardUsers);

export default router;
