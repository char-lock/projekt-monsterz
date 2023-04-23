import { Request, Response } from "express";
import { ApiResponse } from "../shared/api.response";
import UsersData from "./users.data";
import { UserType, ValidationMethod } from "./users.types";
import AuthData from "../auth/auth.data";

/** Handles the logic for any routing requests on the "/users/" endpoint. */
export default class UsersController {

  static getUserById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const userId = parseInt(req.params.id);
    console.log(`request received to get user with id ${userId}`);
    UsersData.getUserById(userId)
      .then((user) => {
        if (user === undefined) {
          return res
            .status(404)
            .describe(`user with id ${userId} does not exist`)
            .send();
        }
        res.send(user);
      })
      .catch((reject) => {
        console.log(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getUserByUsername(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const username = req.params.username;
    console.log(`request received to get user with username ${username}`);
    UsersData.getUserByUsername(username)
      .then((user) => {
        if (user === undefined) {
          return res
            .status(404)
            .describe(`user with username ${username} does not exist`)
            .send();
        }
        return res.send(user);
      })
      .catch((reject) => {
        console.log(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getUsersByValidationValue(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const value = req.params.value;
    console.log(`request received to get user with validation value ${value}`);
    UsersData.getUsersByValidationValue(value)
      .then((users) => {
        if (users.length === 0) {
          return res
            .status(404)
            .describe(`users with validation value ${value} not found`)
            .send();
        }
        return res.send(users);
      })
      .catch((reject) => {
        console.log(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static createUser(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
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
        // With that finished, we now need to create an entry in the
        // authorization data database.
        AuthData.createAuthEntry(createdUser.id, password)
          .then((_) => {
            // Once both of these operations are complete, we can simply
            // send the created user as a response.
            return res.status(201).send(createdUser);
          })
          .catch((authReject) => {
            // If, for some reason, we aren't able to add the authorization,
            // but we were able to add the user data, we will need to delete
            // the created user.
            UsersData.deleteUserById(createdUser.id)
              .then((_) => {
                console.log(authReject);
                res.status(500).describe("unknown server error occurred").send();
              })
              .catch((deleteReject) => {
                // If we aren't able to now delete our previously added user,
                // there's some very strange and catastrophic issue.
                console.log(authReject);
                console.log(deleteReject);
                res.status(500).describe("unknown server error occurred").send();
              });
          });
      })
      .catch((createReject) => {
        // It's possible that we wouldn't be able to create the user for
        // many reasons.
        if (createReject.code === 'P2002' && createReject.meta.target.includes("username")) {
          // This handles the known case where the requested username is already used in
          // the database.
          console.log(`user with username ${username} already exists`);
          return res
            .status(400)
            .describe(`username ${username} is already in use`)
            .send();
        }
        // Any unknown case will simply be marked as a server error in the response.
        console.log(createReject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static deleteUserById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const userId = parseInt(req.params.id);
    // The first step of this process is to delete the user data from the
    // database.
    UsersData.deleteUserById(userId)
      .then((deletedUser) => {
        // Now, we need to delete the authorization entry.
        AuthData.deleteAuthEntry(userId)
          .then((_) => {
            res.describe("user deleted successfully").send();
          })
          .catch((authReject) => {
            // If, for some reason, we are unable to delete the authorization,
            // we will need to restore the previously removed user.
            console.log(authReject);
            if (deletedUser !== undefined) {
              UsersData.createUser(deletedUser)
                .then((_) => {
                  res.status(500).describe("unknown server error occurred").send();
                })
                .catch((createReject) => {
                  // If the recreation fails, we are in some deepwater for the state
                  // of the database.
                  console.log(createReject);
                  res.status(500).describe("unknown server error occurred").send();
                });
              } else {
                res.status(500).describe("unknown server error occurred").send();
              }
          });
      })
      .catch((deleteReject) => {
        console.log(deleteReject);
        // For any unhandled reasons, we respond with a generic server error.
        res.status(500).describe("unknown server error occurred").send();
      });
  }

}
