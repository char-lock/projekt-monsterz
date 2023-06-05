import { PrismaClient } from "@prisma/client";

import ApiLogger from "../../shared/logger";
import UsersData from "../users/users.data";

export default class ClassData {

     static prisma = new PrismaClient();
     static fileLogger = new ApiLogger("class.data.ts");

     static createNewClass(instructorId: number, classCode: string,
          description: string) {
          var logger = ClassData.fileLogger.createFunctionLogger("addClass");
          return ClassData.prisma.class.create({
               data: {
                    instructor: instructorId,
                    class_code: classCode,
                    description: description,
               }
          })
               .then(function (result) {
                    logger.debug("created class with id ".concat(result.class_code.toString()));
                    return result;
               })
               .catch(function (reject) {
                    logger.error(reject);
                    throw (reject);
               });
     };

     static getClassByClassCode(classCode: string) {
          var logger = ClassData.fileLogger.createFunctionLogger("getClassByClassCode");
          return ClassData.prisma.class.findFirstOrThrow({
               where: {
                    class_code: classCode,
               },
          })
               .then(function (result) {
                    return result;
               })
               .catch(function (reject) {
                    logger.error(reject);
                    throw (reject);
               });
     }

     static validateUserById(userId: number) {
          var logger = ClassData.fileLogger.createFunctionLogger("validateUserById");
          return UsersData.prisma.user.update({
               where: {
                    id: userId,
               },
               data: {
                    validated: true,
                    validated_on: Date.now().toString(),
               }
          })
               .then(function (result) {
                    return result;
               })
               .catch(function (reject) {
                    logger.error(reject);
                    throw (reject);
               });
     }

     static invalidateUserById(userId: number) {
          var logger = ClassData.fileLogger.createFunctionLogger("invalidateUserById");
          return UsersData.prisma.user.update({
               where: {
                    id: userId,
               },
               data: {
                    validation_value: "NOCLASS",
                    validated_on: '',
                    validated: false,
               }
          })
               .then(function (result) {
                    return result;
               })
               .catch(function (reject) {
                    logger.error(reject);
                    throw (reject);
               });
     }

     static deleteClassById(classId: number) {
          var logger = ClassData.fileLogger.createFunctionLogger("deleteClassById");
          return ClassData.prisma.class.delete({
               where: {
                    id: classId,
               }
          })
               .then(function (result) {
                    return result;
               })
               .catch(function (reject) {
                    logger.error(reject);
                    throw (reject);
               });
     }

     static removeUserFromClassById(userId: number, classCode: string) {
          var logger = ClassData.fileLogger.createFunctionLogger("removeUserFromClassById");
          return UsersData.prisma.user.updateMany({
               where: {
                    id: userId,
                    validation_value: classCode,
               },
               data: {
                    validation_value: "NOCLASS",
                    validated_on: '',
                    validated: false,
               },
          })
               .then(function (result) {
                    logger.debug("removed user from class: ".concat(classCode.toString()).concat(" with id ").concat(userId.toString()));
                    return result;
               })
               .catch(function (reject) {
                    logger.error(reject);
                    throw (reject);
               });
     }

     static removeAllUsersFromClassById(classCode: string) {
          var logger = ClassData.fileLogger.createFunctionLogger("removeAllUsersFromClass");
          return UsersData.prisma.user.updateMany({
               where: {
                    validation_value: classCode,
               },
               data: {
                    validation_value: "NOCLASS",
                    validated_on: '',
                    validated: false,
               },
          })
               .then(function (result) {
                    logger.debug("removed all user(s) from class: ".concat(classCode));
                    return result;
               })
               .catch(function (reject) {
                    logger.error(reject);
                    throw (reject);
               });
     }
}