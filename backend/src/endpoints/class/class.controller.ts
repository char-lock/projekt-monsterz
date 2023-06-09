import { Request, Response } from "express";

import { ApiResponse } from "../../shared/api.response";
import ApiLogger from "../../shared/logger";
import ClassData from "./class.data";
import { Class, User } from "@prisma/client";

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
                    if (reject.code === "P2002") {
                         logger.debug(`class already exists with username ${classCode}`);
                         return res
                              .status(400)
                              .describe(`Class with ${classCode} is already in use`)
                              .send();
                    }
                    logger.error("unexpected issue occurred");
                    logger.error(reject);
                    return res.status(500).describe("unknown server error occurred").send();
               })
     }

     static getClassByClassCode(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const classCode = req.params.classCode;
          const logger = ClassController.fileLogger.createFunctionLogger("getClassByClassCode");
          logger.debug(`received request: get class id`.concat(classCode.toString()));
          ClassData.getClassByClassCode(classCode)
               .then((value: Class) => {
                    if (value === undefined) {
                         logger.info("user's information unavaiable");
                         return res.status(400).describe("invalid content data").send();
                    }
                    return res.send(value);
               })
               .catch((reject) => {
                    if (reject.code === "P2025") {
                         logger.debug(`There is no class with the following classId code: ${classCode}`);
                         return undefined;
                    }
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
                    if (reject.code === "P2025") {
                         logger.debug(`There is no class with the following classId code: ${classId}`);
                         return undefined;
                    }
                    logger.error("unexpected issue occurred");
                    logger.error(reject);
                    return res.status(500).describe(reject).send();
               });
     }

     static validateUserById(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const userId = parseInt(req.params.userId);
          const logger = ClassController.fileLogger.createFunctionLogger("validateUser");
          logger.debug(`received request: validate user id: `.concat(userId.toString()));
          ClassData.validateUserById(userId)
               .then((value: User) => {
                    if (value === undefined) {
                         logger.info("user's information unavaiable");
                         return res.status(400).describe("invalid content data").send();
                    }
                    return res.send(value);
               })
               .catch((reject) => {
                    if (reject.code === "P2025") {
                         logger.debug(`user with user ID ${userId} not found`);
                         return undefined;
                    }
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
               .then((value: User) => {
                    if (value == undefined) {
                         logger.info("user's information unavaiable");
                         return res.status(400).describe("invalid content data").send();
                    }
                    return res.send(value);
               })
               .catch((reject) => {
                    if (reject.code === "P2025") {
                         logger.debug(`user with user ID ${userId} not found`);
                         return undefined;
                    }
                    logger.error("unexpected issue occurred");
                    logger.error(reject);
                    return res.status(500).describe("unknown server error occurred").send();
               });
     }

     static removeAllUsersFromClassByClassCode(req: Request, rawRes: Response) {
          const res = new ApiResponse(rawRes);
          const classCode = req.body.classCode;
          const logger = ClassController.fileLogger.createFunctionLogger("removeAllUsersFromClass");
          logger.debug(`received request: remove all user from class: ${classCode}`);
          ClassData.removeAllUsersFromClassByClassCode(classCode)
               .then((value: any) => {
                    if (value.count < 1) {
                         logger.info("Users' Information is Unavailable");
                         return res.status(400).describe(`No Students are currently in the ${classCode} class`).send();
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