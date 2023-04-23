import { PrismaClient } from "@prisma/client";
import { NewUser } from "./users.types";
import ApiLogger from "src/shared/logger";

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
        throw(reject);
      });
  }

  static getUserByUsername(username: string) {
    const logger = UsersData.fileLogger.createFunctionLogger("getUserByUsername");
    logger.info(`getting user with username ${username} from database ...`);
    return UsersData.prisma.user.findFirstOrThrow({ where: { username: username } })
      .then((result) => {
        logger.info(`found user with username ${username} - id = ${result.id}`);
        return result;
      })
      .catch((reject) => {
        if (reject.code === "P2025") {
          logger.info(`user with username ${username} not found`);
          return undefined;
        }
        logger.error("unhandled error occurred");
        logger.error(reject);
        throw(reject);
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

  static createUser(user: NewUser) {
    const logger = UsersData.fileLogger.createFunctionLogger("createUser");
    logger.debug("received request to add new user to database");
    return UsersData.prisma.user.create({ data: user })
      .then((result) => {
        logger.debug(`successfully added user to database - id = ${result.id}`);
        return result;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
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
        throw(reject);
      });
  }

}
