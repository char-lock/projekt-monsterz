import { Request, Response } from "express";
import { ApiResponse } from "src/shared/api.response";
import AuthData from "./auth.data";
import UsersData from "../users/users.data";
import { pbkdf2Sync } from "crypto";
import * as jwt from "jsonwebtoken";
import { config } from "../shared/config";
import ApiLogger from "src/shared/logger";

/** Handles the logic for any routing requests on the "auth" endpoint. */
export default class AuthController {

  static fileLogger = new ApiLogger("auth.controller");

  static getAuthToken(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = AuthController.fileLogger.createFunctionLogger("getAuthToken");
    logger.debug("received request: authorize user and give token");
    const { username, password } = req.body;
    const errors = [];
    if (username === undefined) errors.push("username");
    if (password === undefined) errors.push("password");
    if (errors.length !== 0) {
      logger.debug("request is missing fields");
      res
        .status(400)
        .describe(`missing required fields: [${errors.join(", ")}]`)
        .send("");
    }
    // The first step of this process is to retrieve our user information.
    UsersData.getUserByUsername(username)
      .then((user) => {
        if (user === undefined) {
          logger.debug(`${username} is not a valid user`);
          return res
            .status(404)
            .describe(`user with username ${username} not found`)
            .send("");
        }
        // Now, we need to retrieve the secret hash stored in the auth
        // database so that we can hash the provided and compare.
        AuthData.getAuthEntry(user.id)
          .then((userAuth) => {
            if (userAuth === undefined) {
              logger.warn(`${username} exists, but doesn't have an auth record -- this needs to be fixed`);
              console.log(`user ${username} does not have an auth record`);
              return res
                .status(500)
                .describe(`malformed user record`)
                .send("");
            }
            // We can begin the process of checking the provided password
            // now that we have all of the information that we need.
            logger.debug("checking that the password is correct");
            const keyData = userAuth.auth_key.split("$");
            const salt = keyData[0];
            const secret = keyData[1];
            let toTest = pbkdf2Sync(password, salt, 96000, 512, "sha512").toString("hex");
            // We'll now compare the secret to the hashed password in a timing-safe manner.
            let failed = false;
            if (toTest.length !== secret.length) {
              failed = true;
              toTest = secret;
            }
            for (let i = 0; i < secret.length; i++) {
              if (secret[i] !== toTest[i]) failed = true;
            }
            if (failed) {
              logger.debug("provided password didn't match");
              return res
                .status(401)
                .describe("invalid password")
                .send("");
            }
            // After this point, we know that the provided password is
            // correct, so we just need to generate the JWT and send it.
            logger.debug("issued new jwt");
            res.send(jwt.sign(user, config.jwtSecret, { expiresIn: "30m" }));
          })
          .catch((authReject) => {
            logger.error("unhandled exception for getting authorization record");
            logger.error(authReject);
            res
              .status(500)
              .describe(`unknown server error occurred`)
              .send("");
          });
      })
      .catch((userReject) => {
        logger.error("unhandled exception for getting user");
        logger.error(userReject);
        res
          .status(500)
          .describe(`unknown server error occurred`)
          .send();
      });
  }

  static refreshAuth(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = AuthController.fileLogger.createFunctionLogger("refreshAuth");
    logger.debug("request received: refresh auth token");
    if (req.headers.authorization === undefined) {
      logger.debug("no authorization header found");
      return res.status(400).describe("missing authorization header").send("");
    }
    const prevAuth = req.headers.authorization.split(" ");
    if (prevAuth[0].toLowerCase() !== "bearer") {
      logger.debug("request did not have bearer");
      return res.status(400).describe("malformed authorization header").send("");
    }
    try {
      const value = jwt.verify(prevAuth[1], config.jwtSecret);
      logger.debug("valid jwt in header -- issuing new one");
      return res.send(jwt.sign(value, config.jwtSecret, { expiresIn: "30m" }));
    } catch (err) {
      logger.debug(err);
      return res.status(400).describe("invalid authorization header").send("");
    }
  }

}
