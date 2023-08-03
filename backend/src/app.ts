import * as cors from "cors";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";
import * as express from "express";

import { ApiResponse } from "./shared/api.response";
import ApiLogger from "./shared/logger";

import UsersRouter from "./endpoints/users/users.routes";
import AuthRouter from "./endpoints/auth/auth.routes";
import CourseRouter from "./endpoints/course/course.routes";
import LeaderboardRouter from "./endpoints/leaderboard/leaderboard.routes";
import ClassRouter from "./endpoints/class/class.routes";

const fileLogger = new ApiLogger("app");

const app = express.default();

app.use(cors.default());
app.use(helmet.default());
app.use(bodyParser.json());

app.get("/", (_, rawRes: express.Response) => {
  fileLogger.debug("received request at /");
  const res = new ApiResponse(rawRes);
  res.send("welcome to projekt monsterz");
});

app.use("/users/", UsersRouter);
app.use("/auth/", AuthRouter);
app.use("/courses/", CourseRouter);
app.use("/leaderboard/", LeaderboardRouter);
app.use("/class/", ClassRouter)

export default app;
