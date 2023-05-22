import { Request, Response } from "express";

import { ApiResponse } from "../../shared/api.response";
import ApiLogger from "../../shared/logger";

import ClassData from "./class.data";
import { Class } from "@prisma/client";

export default class ClassController {

     static fileLogger = new ApiLogger("class.controller");

     static createNewClass(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const classCode = (req.params.classCode);
          const instructorId = parseInt(req.body.instructorId);
          const description = (req.body.description);
          const logger = ClassController.fileLogger.createFunctionLogger("createNewClass");
          logger.debug(`received request: creating new class`);
          ClassData.createNewClass(instructorId, classCode, description)
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

     static validateUserById(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const userId = parseInt(req.params.userId);
          const logger = ClassController.fileLogger.createFunctionLogger("validateUser");
          logger.debug(`received request: validate user id: `.concat(userId.toString()));
          ClassData.validateUserById(userId)
          .then((value: any) => {
               if (value < 1) {
                    logger.info("user's information unavaiable");
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

     static invalidateUserById(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const userId = parseInt(req.params.userId);
          const logger = ClassController.fileLogger.createFunctionLogger("validateUser");
          logger.debug(`received request: invalidate user id: `.concat(userId.toString()));
          ClassData.invalidateUserById(userId)
          .then((value: any) => {
               if (value < 1) {
                    logger.info("user's information unavaiable");
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
     
     static deleteClassById(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const classId = parseInt(req.params.classId);
          const logger = ClassController.fileLogger.createFunctionLogger("deleteClass");
          logger.debug(`received request: deleting class with class code: `.concat(classId.toString()));
          ClassData.deleteClassById(classId)
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


     static removeUserFromClassById(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const userId = parseInt(req.params.userId);
          const classId = req.body.classId;
          const logger = ClassController.fileLogger.createFunctionLogger("removeUserFromClass");
          logger.debug(`received request: remove user from class: ${classId} with id: ${userId}`);
          ClassData.removeUserFromClassById(userId, classId)
               .then((value: any) => {
                    if (value.count < 1) {
                         logger.info("User's Information is Unavailable");
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

     static removeAllUsersFromClassById(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const classId = req.body.classId;
          const logger = ClassController.fileLogger.createFunctionLogger("removeAllUsersFromClass");
          logger.debug(`received request: remove all user from class: ${classId}`);
          ClassData.removeAllUsersFromClassById(classId)
               .then((value: any) => {
                    if (value.count < 1) {
                         logger.info("Users' Information is Unavailable");
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
}