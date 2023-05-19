import { Request, Response } from "express";

import { ApiResponse } from "../../shared/api.response";
import ApiLogger from "../../shared/logger";

import ClassData from "./class.data";
import { Class, User } from "@prisma/client";

export default class ClassController {

     static fileLogger = new ApiLogger("class.controller");

     //Insert Requests Below
     static createNewClass(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const instructorId = parseInt(req.params.instructorId);
          const logger = ClassController.fileLogger.createFunctionLogger("createNewClass");
          logger.debug(`received request: creating new class`);
          ClassData.addClass(instructorId)
               .then((value: Class) => {
                    if (value === undefined) {
                         logger.info("Class information unavaiable");
                         return res.status(400).describe("invalid content data").send();
                    }
                    return res.send(value);
               })
               .catch((reject) => {
                    logger.error("unexpected issue occurred");
                    logger.error(reject);
                    return res.status(500).describe("unknown server error occurred").send();
               })
     }
     static deleteClass(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const classId = parseInt(req.params.classId);
          const logger = ClassController.fileLogger.createFunctionLogger("deleteClass");
          logger.debug(`received request: deleting class with id: `.concat(classId.toString()));
          ClassData.deleteClass(classId)
               .then((value: Class) => {
                    if (value === undefined) {
                         logger.info("Class information unavaiable");
                         return res.status(400).describe("invalid content data").send();
                    }
                    return res.send(value);
               })
               .catch((reject) => {
                    logger.error("unexpected issue occurred");
                    logger.error(reject);
                    return res.status(500).describe("unknown server error occurred").send();
               });
     }

     static addUserToClass(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const student_id = req.body.student_id;
          const class_id = req.body.class_id;
          const logger = ClassController.fileLogger.createFunctionLogger("addUserToClass");
          logger.debug(`received request: add user to class: ${class_id} with id: ${student_id}`);
          ClassData.addUserToClassById(student_id, class_id)
               .then((student: User) => {
                    if (student === undefined) {
                         logger.info("User's Information is Unavailable");
                         return res.status(400).describe("invalid content data").send();
                    }
                    return res.send(student);
               })
               .catch((reject) => {
                    logger.error("unexpected issue occurred");
                    logger.error(reject);
                    return res.status(500).describe("unknown server error occurred").send();
               });
     }

     static removeUserFromClass(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const student_id = req.body.student_id;
          const class_id = req.body.class_id;
          const logger = ClassController.fileLogger.createFunctionLogger("removeUserFromClass");
          logger.debug(`received request: remove user from class: ${class_id} with id: ${student_id}`);
          ClassData.removeUserFromClassById(student_id, class_id)
               .then((student: any) => {
                    if (student === undefined) {
                         logger.info("User's Information is Unavailable");
                         return res.status(400).describe("invalid content data").send();
                    }
                    return res.send(student);
               })
               .catch((reject) => {
                    logger.error("unexpected issue occurred");
                    logger.error(reject);
                    return res.status(500).describe("unknown server error occurred").send();
               });
     }
     static getStudentsFromClass(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const classId = parseInt(req.params.classId);
          const logger = ClassController.fileLogger.createFunctionLogger("getStudentsFromClass");
          logger.debug(`received request: get users from class: ${classId} with id`);
          ClassData.getStudentsFromClass(classId)
          .then((students: any) => {
               if (students === undefined) {
                    logger.info("User's Information is Unavailable");
                    return res.status(400).describe("invalid content data").send();
               }
               return res.send(students);
          })
          .catch((reject) => {
               logger.error("unexpected issue occurred");
               logger.error(reject);
               return res.status(500).describe("unknown server error occurred").send();
          });
     }
}