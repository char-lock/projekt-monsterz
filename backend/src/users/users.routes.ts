import { Router } from "express";

import UsersController from "./users.controller";

const router = Router();

// Get a user via their UUID.
router.get("/id/:id([0-9]+)", UsersController.getUserById);

export default router;
