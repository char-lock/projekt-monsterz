import { Request, Response } from "express";
import { ApiResponse } from "../shared/api.response";
import UsersData from "./users.data";
import { UserType, ValidationMethod } from "./users.types";
import AuthData from "../auth/auth.data";
import ApiLogger from "src/shared/logger";

/** Handles the logic for any routing requests on the "/users/" endpoint. */
export default class UsersController {

  static fileLogger = new ApiLogger("users.controller");

  static getUserById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = UsersController.fileLogger
      .createFunctionLogger("getUserById");
    const userId = parseInt(req.params.id);
    logger.debug(`request received: get user with id ${userId}`);
    UsersData.getUserById(userId)
      .then((user) => {
        if (user === undefined) {
          logger.debug(`could not find user with id ${userId}`);
          return res
            .status(404)
            .describe(`user with id ${userId} does not exist`)
            .send();
        }
        logger.debug(`found user with is ${userId}: ${user.username}`);
        res.send(user);
      })
      .catch((reject) => {
        console.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getUserByUsername(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = UsersController.fileLogger.createFunctionLogger("getUserByUsername");
    const username = req.params.username;
    logger.debug(`request received: get user with username ${username}`);
    UsersData.getUserByUsername(username)
      .then((user) => {
        if (user === undefined) {
          logger.debug(`could not find user with username ${username}`);
          return res
            .status(404)
            .describe(`user with username ${username} does not exist`)
            .send();
        }
        logger.debug(`found user with username ${username} - id = ${user.id}`);
        return res.send(user);
      })
      .catch((reject) => {
        logger.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getUsersByValidationValue(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = UsersController.fileLogger.createFunctionLogger("getUsersByValidationValue");
    const value = req.params.value;
    logger.debug(`request received: get user with validation value ${value}`);
    UsersData.getUsersByValidationValue(value)
      .then((users) => {
        if (users.length === 0) {
          logger.debug(`no users found with validation value ${value}`);
          return res
            .status(404)
            .describe(`users with validation value ${value} not found`)
            .send();
        }
        logger.debug(`found ${users.length} users with validation value ${value}`);
        return res.send(users);
      })
      .catch((reject) => {
        logger.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static createUser(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = UsersController.fileLogger.createFunctionLogger("createUser");
    logger.debug(`received request: create new user`);
    const {
      username,
      password,
      validation_method,
      validation_value
    } = req.body;
    const errors: string[] = [];
    if (username === undefined) errors.push("username");
    if (password === undefined) errors.push("password");
    if (validation_method === undefined) errors.push("validation_method");
    if (validation_value === undefined) errors.push("validation_value");
    if (errors.length > 0) {
      logger.debug(`could not create user due to malformed request`);
      return res
        .status(400)
        .describe(`missing fields: [${errors.join(", ")}]`)
        .send();
    }
    const user = {
      username: username,
      user_type: validation_method === ValidationMethod.EDUCATION_CODE
        ? UserType.STUDENT
        : UserType.INDIVIDUAL,
      created_on: Date.now().toString(),
      validated: false,
      validated_on: "-1",
      validation_method: validation_method,
      validation_value: validation_value,
      progress_lesson: 0,
      progress_content: 0
    }
    // The first part of the user registration process is to add
    // the entry to the database with the user details.
    UsersData.createUser(user)
      .then((createdUser) => {
        logger.debug("successfully added new user data to the database")
        // With that finished, we now need to create an entry in the
        // authorization data database.
        AuthData.createAuthEntry(createdUser.id, password)
          .then((_) => {
            logger.debug("successfully added new user auth data to the database");
            // Once both of these operations are complete, we can simply
            // send the created user as a response.
            return res.status(201).send(createdUser);
          })
          .catch((authReject) => {
            logger.error("unable to save user auth to database");
            // If, for some reason, we aren't able to add the authorization,
            // but we were able to add the user data, we will need to delete
            // the created user.
            UsersData.deleteUserById(createdUser.id)
              .then((_) => {
                logger.error(authReject);
                res.status(500).describe("unknown server error occurred").send();
              })
              .catch((deleteReject) => {
                // If we aren't able to now delete our previously added user,
                // there's some very strange and catastrophic issue.
                logger.error("unable to delete newly added user -- something weird is going on");
                logger.error(authReject);
                logger.error(deleteReject);
                res.status(500).describe("unknown server error occurred").send();
              });
          });
      })
      .catch((createReject) => {
        logger.debug("unable to add user to database");
        // It's possible that we wouldn't be able to create the user for
        // many reasons.
        if (createReject.code === 'P2002' && createReject.meta.target.includes("username")) {
          logger.debug(`user already exists with username ${username}`);
          // This handles the known case where the requested username is already used in
          // the database.
          return res
            .status(400)
            .describe(`username ${username} is already in use`)
            .send();
        }
        // Any unknown case will simply be marked as a server error in the response.
        logger.error(createReject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static deleteUserById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = UsersController.fileLogger.createFunctionLogger("deleteUserById");
    const userId = parseInt(req.params.id);
    logger.debug(`received request: delete user with id ${userId}`);
    // The first step of this process is to delete the user data from the
    // database.
    UsersData.deleteUserById(userId)
      .then((deletedUser) => {
        logger.debug("successfully deleted user from database");
        // Now, we need to delete the authorization entry.
        AuthData.deleteAuthEntry(userId)
          .then((_) => {
            logger.debug("successfully deleted user auth from database");
            res.describe("user deleted successfully").send();
          })
          .catch((authReject) => {
            logger.debug("able to add user, but unable to add user auth");
            // If, for some reason, we are unable to delete the authorization,
            // we will need to restore the previously removed user.
            logger.error(authReject);
            if (deletedUser !== undefined) {
              UsersData.createUser(deletedUser)
                .then((_) => {
                  res.status(500).describe("unknown server error occurred").send();
                })
                .catch((createReject) => {
                  // If the recreation fails, we are in some deepwater for the state
                  // of the database.
                  logger.error("unable to recreate the originally deleted user -- there's something weird going on");
                  logger.error(createReject);
                  res.status(500).describe("unknown server error occurred").send();
                });
              } else {
                logger.debug("weirdly, there's no deleted user data to recreate");
                res.status(500).describe("unknown server error occurred").send();
              }
          });
      })
      .catch((deleteReject) => {
        logger.error(deleteReject);
        // For any unhandled reasons, we respond with a generic server error.
        res.status(500).describe("unknown server error occurred").send();
      });
  }

}
