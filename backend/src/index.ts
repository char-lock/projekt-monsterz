import * as cors from "cors";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";
import * as express from "express";

import UsersRouter from "./users/users.routes";
import AuthRouter from './auth/auth.routes';

const app = express.default();

app.use(cors.default());
app.use(helmet.default());
app.use(bodyParser.json());

app.get("/", (_, res: express.Response) => {
  res.status(200).json({ data: "ok" });
});

app.use("/users/", UsersRouter);
app.use("/auth/", AuthRouter);

app.listen(9696, () => {
  console.log("server started on 9696");
});
