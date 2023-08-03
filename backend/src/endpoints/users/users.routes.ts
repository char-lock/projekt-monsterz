import { Router } from "express";
import { ApiResponse } from "../../shared/api.response";

import UsersController from "./users.controller";

const router = Router();

// Get a user via their UUID.
router.get("/id/:id([0-9]+)", UsersController.getUserById);

// Delete a user via their UUID.
router.delete("/id/:id([0-9]+)", UsersController.deleteUserById);

// Get a user via their username.
router.get("/username/:username", UsersController.getUserByUsername);

// Get users via their validation value.
router.get("/validation/:value", UsersController.getUsersByValidationValue);

// Verify endpoint
router.get("/", (_, res) => {
  (new ApiResponse(res)).send("users endpoint");
});

// Create a user
router.post("/", UsersController.createUser);

// Updates a user's progress.
router.post("/username/:username/progress", UsersController.postUserProgressByUsername);

export default router;
