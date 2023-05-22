import { PrismaClient } from "@prisma/client";

import ApiLogger from "../../shared/logger";
import { NewCourseContent, NewCourseLesson, NewCourseUnit } from "./course.types";

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

  static addUnit(unit: NewCourseUnit) {
    const logger = CourseData.fileLogger.createFunctionLogger("addUnit");
    logger.debug(`adding unit to database:\n${JSON.stringify(unit)}`);
    return this.prisma.courseUnit.create({ data: unit })
      .then((result) => {
        logger.debug(`created unit with id ${result.id}`);
        return result;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      });
  }

  static getLessonIdsByUnit(unitId: number) {
    const logger = CourseData.fileLogger.createFunctionLogger("getLessonIdsByUnit");
    logger.debug(`getting lesson ids in unit ${unitId}`);
    return this.prisma.courseLesson.findMany({
      select: { id: true },
      where: { unit_id: unitId },
       
    })
      .then((lessonIds) => {
        logger.debug(`found ${lessonIds.length} lessons in unit ${unitId}`);
        return lessonIds.map((value) => { return value.id; });
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      });
  }

  static getLessonById(lessonId: number) {
    const logger = CourseData.fileLogger.createFunctionLogger("getLessonById");
    logger.debug(`getting metadata for lesson with id ${lessonId}`);
    return this.prisma.courseLesson.findFirstOrThrow({ where: { id: lessonId } })
      .then((lesson) => {
        logger.debug(`found lesson id: ${lessonId} - title = ${lesson.title}`);
        return lesson;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      });
  }

  static getLessonByPosition(unitId: number, lessonPosition: number) {
    const logger = CourseData.fileLogger.createFunctionLogger("getLessonByPosition");
    logger.debug(`getting lesson ${lessonPosition} in unit ${unitId}`);
    return this.prisma.courseLesson.findFirstOrThrow({ 
      where: { position: lessonPosition, unit_id: unitId }
    })
      .then((lesson) => {
        logger.debug(`found lesson ${lessonPosition} unit ${unitId}: id = ${lesson.id}`);
        return lesson;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      })
  }

  static addLesson(lesson: NewCourseLesson) {
    const logger = CourseData.fileLogger.createFunctionLogger("addLesson");
    logger.debug(`adding lesson to database:\n${JSON.stringify(lesson)}`);
    return this.prisma.courseLesson.create({ data: lesson })
      .then((result) => {
        logger.debug(`created lesson with id ${result.id}`);
        return result;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      });
  }
  static deleteContentByID(contentIdNumber: number,
    lessonId: number) {
    var logger = CourseData.fileLogger.createFunctionLogger("deleteContent");
    logger.debug("deleting content with id".concat(JSON.stringify(contentIdNumber)));
    this.prisma.courseLesson.update({
      where: {
        id: lessonId,
      },
      data: {
        content_count: {
          increment: -1,
        }
      }
    });
    return this.prisma.courseContent.delete({
      where: {
        id: contentIdNumber,
      }
    })
      .then(function (result) {
        logger.debug("delete content with id ".concat(result.id.toString()));
        return result;
      })
      .catch(function (reject) {
        logger.error(reject);
        throw (reject);
      });
  };

  static getContentById(contentId: number) {
    const logger = CourseData.fileLogger.createFunctionLogger("getContentById");
    logger.debug(`getting content with id ${contentId}`);
    return this.prisma.courseContent.findFirstOrThrow({ where: { id: contentId } })
      .then((content) => {
        logger.debug(`found lesson id ${contentId}`);
        return content;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      });
  }

  static getContentByLesson(lessonId: number) {
    const logger = CourseData.fileLogger.createFunctionLogger("getContentByLesson");
    logger.debug(`getting content for lesson with id ${lessonId}`);
    return this.prisma.courseContent.findMany({ where: { lesson_id: lessonId},})
      .then((content) => {
        logger.debug(`found ${content.length} content items for lesson id ${lessonId}`);
        return content;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      });
  }

  static getContentByPosition(lessonId: number, position: number) {
    const logger = CourseData.fileLogger.createFunctionLogger("getContentByPosition");
    logger.debug(`getting content at position ${position} for lesson with id ${lessonId}`);
    return this.prisma.courseContent.findFirstOrThrow({ 
      where: { position: position, lesson_id: lessonId } 
    })
      .then((content) => {
        logger.debug(`found content for lesson id ${lessonId}, position ${position}`);
        return content;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      });
  }

  static addContent(content: NewCourseContent) {
    const logger = CourseData.fileLogger.createFunctionLogger("addContent");
    logger.debug(`adding unit to database:\n${JSON.stringify(content)}`);
    return this.prisma.courseContent.create({ data: content })
      .then((result) => {
        logger.debug(`created unit with id ${result.id}`);
        return result;
      })
      .catch((reject) => {
        logger.error(reject);
        throw(reject);
      });
  }

}
