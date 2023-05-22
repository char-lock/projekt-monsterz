import { Router } from "express";

import ClassController from "./class.controller";

const router = Router();

//For educator users, used to create a new class.
router.post("/new/:classCode([a-zA-Z]{6})", ClassController.createNewClass);

//For educator users, used to delete a new class.
router.delete("/end/:classId([0-9]+)", ClassController.deleteClassById);

//For educator users, used to remove users from a class.
router.post("/student/:userId([0-9]+)/removal/", ClassController.removeUserFromClassById);

//For educator users, validate users that elected to 
router.post("/student/:userId([0-9]+)/valid/", ClassController.validateUserById);

//For educator users, to remove a request to join the class.
router.post("/student/:userId([0-9]+)/invalid/", ClassController.invalidateUserById);

//For educator users, used to remove all users from a class.
router.post("/student/removeAll", ClassController.removeAllUsersFromClassById);

export default router;