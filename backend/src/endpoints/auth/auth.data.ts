import { PrismaClient } from "@prisma/client";
import { pbkdf2Sync, getRandomValues } from "crypto";

import ApiLogger from "../../shared/logger";

export default class AuthData {

  static prisma = new PrismaClient();
  static fileLogger = new ApiLogger("auth.data");

  static hashPassword(password: string) {
    const saltValues = new Uint8Array(12);
    getRandomValues(saltValues);
    const salt = Array.from(saltValues)
      .map((value) => { return value.toString(16);})
      .join("");
    const hashed = pbkdf2Sync(password, salt, 96000, 512, "sha512").toString("hex");
    return `${salt}$${hashed}`;
  }

  static createAuthEntry(userId: number, password: string) {
    const logger = AuthData.fileLogger.createFunctionLogger("createAuthEntry");
    logger.debug("received request to add new auth entry");
    logger.debug("hashing provided password so that future login requests never send plaintext");
    password = AuthData.hashPassword(password);
    return AuthData.prisma.userAuth.create({ 
      data: { 
        user_id: userId, 
        auth_key: password, 
        changed_on: Date.now().toString() 
      } 
    })
      .then((_) => {
        logger.debug("successfully added auth entry");
        return true;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      });
  }

  static deleteAuthEntry(userId: number) {
    const logger = AuthData.fileLogger.createFunctionLogger("deleteAuthEntry");
    logger.debug(`deleting id ${userId} from auth database ...`);
    return AuthData.prisma.userAuth.delete({ where: { user_id: userId } })
      .then((_) => {
        logger.debug("successfully deleted auth entry");
        return true;
      })
      .catch((reject) => {
        if (reject.code === "P2025") {
          logger.debug(`user with userId ${userId} not found`);
          return true;
        }
        logger.error(reject);
        throw(reject);
      });
  }

  static getAuthEntry(userId: number) {
    const logger = AuthData.fileLogger.createFunctionLogger("getAuthEntry");
    logger.debug(`getting auth entry for id ${userId} from database ...`);
    return AuthData.prisma.userAuth.findFirstOrThrow({where: { user_id: userId } })
      .then((response) => {
        logger.debug("successfully found auth entry");
        return response;
      })
      .catch((reject) => {
        if (reject.code === "P2025") {
          logger.debug(`user with userId ${userId} not found`);
          return undefined;
        }
        logger.error(reject);
        throw (reject);
      });
  }

}
