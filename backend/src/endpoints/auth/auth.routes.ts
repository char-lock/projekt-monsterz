import { Router } from "express";
import { ApiResponse } from "../../shared/api.response";

import AuthController from "./auth.controller";

const router = Router();

router.get("/", (_, res) => {
  (new ApiResponse(res)).send("auth endpoint");
});

// Authorize user and generate token
router.post("/login", AuthController.getAuthToken);

// Refresh auth token
router.get("/refresh", AuthController.refreshAuth);

export default router;
