import { PrismaClient } from "@prisma/client";
import ApiLogger from "../shared/logger";

export default class CourseData {

  static prisma = new PrismaClient();
  static fileLogger = new ApiLogger("course.data");

  static getUnitById(unitId: number) {
    const logger = CourseData.fileLogger.createFunctionLogger("getUnitById");
    logger.debug(`getting unit with id ${unitId} ...`);
    return this.prisma.courseUnit.findFirstOrThrow({ where: { id: unitId } })
      .then((result) => {
        logger.debug(`found unit with id ${unitId} -- ${result.title}`);
        return result;
      })
      .catch((reject) => {
        logger.error(JSON.stringify(reject));
        throw(reject);
      });
  }

}
