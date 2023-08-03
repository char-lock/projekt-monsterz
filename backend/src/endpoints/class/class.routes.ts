import { Router } from "express";
import { ApiResponse } from "../../shared/api.response";

import ClassController from "./class.controller";

const router = Router();

router.get("/", (_, res) => {
  (new ApiResponse(res)).send("class endpoint");
});

//For educator users, used to create a new class.
router.post("/:classCode([a-zA-Z]{6})/new", ClassController.createNewClass);

//For educator users, used to pull class information.
router.get("/:classCode([a-zA-Z]{6})", ClassController.getClassByClassCode)

//For educator users, used to delete a new class.
router.delete("/:classId([0-9]+)/end", ClassController.deleteClassById);

//For educator users, used to remove all users from a class.
router.post("/:classCode([a-zA-Z]{6})/invalid", ClassController.removeAllUsersFromClassByClassCode);

//For educator users, validate users that elected to 
router.post("/student/:userId([0-9]+)/valid", ClassController.validateUserById);

//For educator users, to remove a request to join the class.
router.post("/student/:userId([0-9]+)/invalid", ClassController.invalidateUserById);

export default router;