import { Router } from "express";

import LeaderboardController from "./leaderboard.controller";

const router = Router();

router.get("/:count([0-9]+)", LeaderboardController.getGlobalLeaderboardUsers);

router.get("/class/:educationCode/:count([0-9]+)", LeaderboardController.getClassLeaderboardUsers);

export default router;
