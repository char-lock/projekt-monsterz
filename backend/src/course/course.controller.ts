import { Request, Response } from "express";
import ApiLogger from "../shared/logger";
import CourseData from "./course.data";
import { ApiResponse } from "src/shared/api.response";

export default class CourseController {

  static fileLogger = new ApiLogger("course.controller");

  static getUnitMetadataById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getUnitMetadataById");
    const unitId = parseInt(req.params.unitId);
    logger.debug(`received request: get unit metadata for ${unitId}`);
    CourseData.getUnitById(unitId)
      .then((result) => {
        if (result === undefined) {
          console.debug(`unit ${unitId} does not exist`);
          res.status(404).describe(`unit with id ${unitId} does not exist`);
        }
        res.send(result);
      })
      .catch((reject) => {
        logger.error("unhandled error encountered");
        logger.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getLessonIdsInUnit(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getLessonIdsInUnit");
    const unitId = req.params.unitId;
    logger.debug(`received request: get lesson ids in unit ${unitId}`);
  }

  static getLessonMetadataById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getLessonMetadataById");
    const lessonId = req.params.lessonId;
    logger.debug(`received request: get metadata for lesson ${lessonId}`);
  }

  static getContentById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getContentById");
    const contentId = req.params.contentId;
    logger.debug(`received request: get content with id ${contentId}`);
  }

  static getAllContentByLesson(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getAllContentByLesson");
    const { unitId, lessonPosition } = req.params;
    logger.debug(`received request: get all content for unit ${unitId}, lesson #${lessonPosition}`);
  }

  static getContentByPosition(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getContentByPosition");
    const { unitId, lessonPosition, contentPosition } = req.params;
    logger.debug(`received request: get content #${contentPosition} for unit ${unitId}, lesson #${lessonPosition}`);
  }

}
