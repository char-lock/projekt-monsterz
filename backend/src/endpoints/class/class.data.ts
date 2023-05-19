import { PrismaClient } from "@prisma/client";

import ApiLogger from "../../shared/logger";
import UsersData from "../users/users.data";

export default class ClassData {

     static prisma = new PrismaClient();
     static fileLogger = new ApiLogger("class.data.ts");
     
     static addClass(instructorId: number) {
          var logger = ClassData.fileLogger.createFunctionLogger("addClass");
          var classId = Math.floor(100000 + Math.random() * 900000); //Randomly generated number with six digits.
          var date = new Date(Date.now()).toISOString();
          //Need to have a better way to check if unique.
          return ClassData.prisma.class.create({
               data: {
                    id: classId,
                    instructor: instructorId,
                    created_on: date,
               }
          })
               .then(function (result) {
                    logger.debug("created class with id ".concat(result.id.toString()));
                    return result;
               })
               .catch(function (reject) {
                    logger.error(reject);
                    throw (reject);
               });
     };
     static deleteClass(classId: number) {
          var logger = ClassData.fileLogger.createFunctionLogger("deleteClass");
          return ClassData.prisma.class.delete({
               where: {
                    id: classId,
               }
          })
          .then(function (result) {
               logger.debug("deleted class with id ".concat(result.id.toString()));
               return result;
          })
          .catch(function (reject) {
               logger.error(reject);
               throw (reject);
          });
     }
     static addUserToClassById(student_id: number, class_id: number) {
          var logger = ClassData.fileLogger.createFunctionLogger("addUserToClassById");
          return UsersData.prisma.user.update({
               where: {
                    id: student_id,
               },
               data: {
                    class_id: class_id,
               }
          })
          .then(function (result) {
               logger.debug("added user to class with id: ".concat(result.id.toString()));
               return result;
          })
          .catch(function (reject) {
               logger.error(reject);
               throw (reject);
          });
     }
     static removeUserFromClassById(student_id: number, classID: number) {
          var logger = ClassData.fileLogger.createFunctionLogger("removeUserFromClassById");
          return UsersData.prisma.user.updateMany({
               where: {
                    id: student_id,
                    class_id: classID,
               },
               data: {
                    class_id: 0,
               },
          })
          .then(function (result) {
               logger.debug("removed user from class: ".concat(classID.toString()).concat(" with id ").concat(student_id.toString()));
               return result;
          })
          .catch(function (reject) {
               logger.error(reject);
               throw (reject);
          });
     }
     static getStudentsFromClass(classID: number) {
          var logger = ClassData.fileLogger.createFunctionLogger("getStudentsFromClass");
          return UsersData.prisma.user.findMany({
               where: {
                    class_id: classID,
               },
          })
          .then(function (result) {
               logger.debug("Grabbing users from class: ".concat(classID.toString()));
               return result;
          })
          .catch(function (reject) {
               logger.error(reject);
               throw (reject);
          });

     }
}