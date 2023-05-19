import { Router } from "express";

import ClassController from "./class.controller";

const router = Router();

//For educator users, used to create a new class.
router.post("/newclass/:instructorId([0-9+])", ClassController.createNewClass);

//For educator users, used to delete a new class.
router.delete("/endclass/:classId", ClassController.deleteClass);

//For educator users, used to add users to a class.
router.post("/student/new", ClassController.addUserToClass);

//For educator users, used to remove users from a class.
router.post("/student/removal", ClassController.removeUserFromClass);

//For educator users, retrieve all the students from a class.
router.get("/students/:classId", ClassController.getStudentsFromClass);

export default router;