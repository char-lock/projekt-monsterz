import { Router } from "express";

import AuthController from "./auth.controller";

const router = Router();

// Authorize user and generate token
router.post("/login", AuthController.getAuthToken);

// Refresh auth token
router.get("/refresh", AuthController.refreshAuth);

export default router;
