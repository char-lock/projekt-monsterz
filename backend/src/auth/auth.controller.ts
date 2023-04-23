import { Request, Response } from "express";
import { ApiResponse } from "src/shared/api.response";
import AuthData from "./auth.data";
import UsersData from "../users/users.data";
import { pbkdf2Sync } from "crypto";
import * as jwt from "jsonwebtoken";
import { config } from "../shared/config";

/** Handles the logic for any routing requests on the "auth" endpoint. */
export default class AuthController {

  static getAuthToken(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const { username, password } = req.body;
    const errors = [];
    if (username === undefined) errors.push("username");
    if (password === undefined) errors.push("password");
    if (errors.length !== 0) {
      res
        .status(400)
        .describe(`missing required fields: [${errors.join(", ")}]`)
        .send("");
    }
    // The first step of this process is to retrieve our user information.
    UsersData.getUserByUsername(username)
      .then((user) => {
        if (user === undefined) {
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
              console.log(`user ${username} does not have an auth record`);
              return res
                .status(500)
                .describe(`malformed user record`)
                .send("");
            }
            // We can begin the process of checking the provided password
            // now that we have all of the information that we need.
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
              return res
                .status(401)
                .describe("invalid password")
                .send("");
            }
            // After this point, we know that the provided password is
            // correct, so we just need to generate the JWT and send it.
            res.send(jwt.sign(user, config.jwtSecret, { expiresIn: "30m" }));
          })
          .catch((authReject) => {
            console.log(authReject);
            res
              .status(500)
              .describe(`unknown server error occurred`)
              .send("");
          });
      })
      .catch((userReject) => {
        console.log(userReject);
        res
          .status(500)
          .describe(`unknown server error occurred`)
          .send();
      })
  }

  static refreshAuth(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    if (req.headers.authorization === undefined)
      return res.status(400).describe("missing authorization header").send("");
    const prevAuth = req.headers.authorization.split(" ");
    if (prevAuth[0].toLowerCase() !== "bearer")
      return res.status(400).describe("malformed authorization header").send("");
    try {
      const value = jwt.verify(prevAuth[1], config.jwtSecret);
      return res.send(jwt.sign(value, config.jwtSecret, { expiresIn: "30m" }));
    } catch (err) {
      console.log(err);
      return res.status(400).describe("invalid authorization header").send("");
    }
  }

}
