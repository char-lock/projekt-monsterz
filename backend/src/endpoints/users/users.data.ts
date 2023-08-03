import { PrismaClient } from "@prisma/client";

import ApiLogger from "../../shared/logger";
import { NewUser, ValidationMethod } from "./users.types";
import CourseData from "../course/course.data";

export default class UsersData {

  static prisma = new PrismaClient();
  static fileLogger = new ApiLogger("users.data");

  static getUserById(userId: number) {
    const logger = UsersData.fileLogger.createFunctionLogger("getUserById");
    logger.debug(`getting user with id ${userId} from database ...`);
    return UsersData.prisma.user.findFirstOrThrow({ where: { id: userId } })
      .then((result) => {
        logger.debug(`found user with id ${userId} - ${result.username}`);
        return result;
      })
      .catch((reject) => {
        if (reject.code === 'P2025') {
          logger.debug(`user with id ${userId} not found`);
          return undefined;
        }
        logger.error(`unhandled error occurred`);
        logger.error(reject);
        throw (reject);
      });
  }

  static getUserByUsername(username: string) {
    const logger = UsersData.fileLogger.createFunctionLogger("getUserByUsername");
    logger.debug(`getting user with username ${username} from database ...`);
    return UsersData.prisma.user.findFirstOrThrow({ where: { username: username } })
      .then((result) => {
        logger.debug(`found user with username ${username} - id = ${result.id}`);
        return result;
      })
      .catch((reject) => {
        if (reject.code === "P2025") {
          logger.debug(`user with username ${username} not found`);
          return undefined;
        }
        logger.error("unhandled error occurred");
        logger.error(reject);
        throw (reject);
      })
  }

  static getUsersByValidationValue(value: string) {
    const logger = UsersData.fileLogger.createFunctionLogger("getUsersByValidationValue");
    logger.debug(`getting users with validation value ${value} from database ...`);
    return UsersData.prisma.user.findMany({ where: { validation_value: value } })
      .then((result) => {
        logger.debug(`found ${result.length} users with validation value ${value}`);
        return result;
      });
  }

  static getUsersByScore(count: number) {
    const logger = UsersData.fileLogger.createFunctionLogger("getUsersByScore");
    logger.debug(`getting ${count} users from database, sorting by progress ...`);
    return UsersData.prisma.user.findMany({
      orderBy: [{ progress_lesson: "desc" }, { progress_content: "desc" }],
      take: count
    })
      .then((result) => {
        logger.debug(`found ${result.length} users`);
        return result;
      });
  }

  static getClassUsersByScore(educationCode: string, count: number) {
    const logger = UsersData.fileLogger.createFunctionLogger("getUsersByScore");
    logger.debug(`getting ${count} users from database with education code ${educationCode}, sorting by progress ...`);
    return UsersData.prisma.user.findMany({
      orderBy: [{ progress_lesson: "desc" }, { progress_content: "desc" }],
      take: count,
      where: { validation_value: educationCode }
    })
      .then((result) => {
        logger.debug(`found ${result.length} users with education code ${educationCode}`);
        return result;
      });
  }

  static createUser(user: NewUser) {
    const logger = UsersData.fileLogger.createFunctionLogger("createUser");
    logger.debug("received request to add new user to database");
    return UsersData.getUsersByValidationValue(user.validation_value).then((value) => {
      if (user.validation_method !== ValidationMethod.EMAIL || value.length === 0) {
        return UsersData.prisma.user.create({ data: user })
          .then((result) => {
            logger.debug(`successfully added user to database - id = ${result.id}`);
            return result;
          })
          .catch((reject) => {
            if (reject.code === "P2002" && reject.meta.target.includes("username")) {
              logger.debug("user already exists -- throwing ...");
            } else {
              logger.error("unhandled error occurred");
              logger.error(JSON.stringify(reject));
            }
            throw (reject);
          });
      } else {
        throw({
          code: "P2002",
          meta: {
            target: "validation_value"
          }
        });
      }
    });
  }

  static deleteUserById(userId: number) {
    const logger = UsersData.fileLogger.createFunctionLogger("deleteUserById");
    logger.debug(`received request to delete user with id ${userId}`);
    return UsersData.prisma.user.delete({ where: { id: userId } })
      .then((deletedUser) => {
        logger.debug("successfully delete user from database");
        return deletedUser;
      })
      .catch((reject) => {
        if (reject.code === "P2025") {
          logger.debug(`user with userId ${userId} not found`);
          return undefined;
        }
        logger.error("unhandled error occurred");
        logger.error(reject);
        throw (reject);
      });
  }

  static postContentProgressByUsername(userName: string, progressContent: number) {
    const logger = UsersData.fileLogger.createFunctionLogger("update User Content Progress");
    logger.debug(`getting user with username ${userName} from database ...`);
    return UsersData.prisma.user.update({
      where: {
        username: userName,
      },
      data: {
        progress_content: progressContent,
      },
    }).then((user) => {
      logger.debug("successfully updated user's content progress to database");
      return user;
    })
      .catch((reject) => {
        if (reject.code === "P2025") {
          logger.debug(`user with username ${userName} not found`);
          return undefined;
        }
        logger.error("unhandled error occurred");
        logger.error(reject);
        throw (reject);
      });
  }

  static postLessonProgressByUsername(userName: string, progressLesson: number) {
    const logger = UsersData.fileLogger.createFunctionLogger("update User Content Progress");
    logger.debug(`getting user with username ${userName} from database ...`);
    let lowestAvailableContent;
    UsersData.getLowestAvailableContent(progressLesson).then((value) => {
      lowestAvailableContent = value;
    });
    return UsersData.prisma.user.update({
      where: {
        username: userName,
      },
      data: {
        progress_content: lowestAvailableContent,
        progress_lesson: progressLesson,
      },
    }).then((user) => {
      logger.debug("successfully updated user's lesson progress to database");
      return user;
    })
      .catch((reject) => {
        if (reject.code === "P2025") {
          logger.debug(`user with username ${userName} not found`);
          return undefined;
        }
        logger.error("unhandled error occurred");
        logger.error(reject);
        throw (reject);
      });
  }

  static getLowestAvailableContent(progressLesson: number) {
    const logger = UsersData.fileLogger.createFunctionLogger("get Lowest Available Content");
    logger.debug(`getting lowest content of Lesson ${progressLesson.toString()} from database ...`);
    return CourseData.prisma.courseContent.findMany({
      where: {
        lesson_id: progressLesson,
      },
      orderBy: {
        position: 'asc',
      },
      take: 1,
    });
  }
}