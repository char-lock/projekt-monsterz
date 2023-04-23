import { Request, Response } from "express";

import { ApiResponse } from "src/shared/api.response";
import ApiLogger from "../../shared/logger";

import CourseData from "./course.data";

/** Handles requests on the course endpoint */
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
          return res
            .status(404)
            .describe(`unit with id ${unitId} does not exist`)
            .send();
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
    const unitId = parseInt(req.params.unitId);
    logger.debug(`received request: get lesson ids in unit ${unitId}`);
    CourseData.getLessonIdsByUnit(unitId)
      .then((lessonIds) => {
        if (lessonIds.length === 0) {
          logger.debug("no ids found for the unit");
          return res
            .status(404)
            .describe(`no lessons found for unit ${unitId}`)
            .send([]);
        }
        res.send(lessonIds);
      })
      .catch((reject) => {
        logger.error("unhandled error encountered");
        logger.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getLessonMetadataById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getLessonMetadataById");
    const lessonId = parseInt(req.params.lessonId);
    logger.debug(`received request: get metadata for lesson ${lessonId}`);
    CourseData.getLessonById(lessonId)
      .then((lesson) => {
        res.send(lesson);
      })
      .catch((reject) => {
        logger.error("unhandled error encountered");
        logger.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getContentById(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getContentById");
    const contentId = parseInt(req.params.contentId);
    logger.debug(`received request: get content with id ${contentId}`);
    CourseData.getContentById(contentId)
      .then((content) => {
        res.send(content);
      })
      .catch((reject) => {
        logger.error("unhandled error encountered");
        logger.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getAllContentByLesson(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getAllContentByLesson");
    const unitId = parseInt(req.params.unitId);
    const lessonPosition = parseInt(req.params.lessonPosition);
    logger.debug(`received request: get all content for unit ${unitId}, lesson #${lessonPosition}`);
    CourseData.getLessonByPosition(unitId, lessonPosition)
      .then((lesson) => {
        if (lesson === undefined) {
          logger.debug(`unable to find lesson in position ${lessonPosition} for unit id ${unitId}`);
          return res
            .status(404)
            .describe(`lesson in position ${lessonPosition} does not exist for unit id ${unitId}`)
            .send();
        }
        CourseData.getContentByLesson(lesson.id)
          .then((content) => {
            if (content.length === 0) {
              logger.debug(`no content found for lesson ${lessonPosition} unit ${unitId}`);
              return res
                .status(404)
                .describe(`content for lesson ${lessonPosition} unit ${unitId} does not exist`)
                .send();
            }
            logger.debug(`sending ${content.length} content items for lesson ${lessonPosition} unit ${unitId}}`);
            res.send(content);
          })
          .catch((contentReject) => {
            logger.error("unhandled error exception while getting content");
            logger.error(contentReject);
            res.status(500).describe("unknown server errror occurred").send();
          });
      })
      .catch((lessonReject) => {
        logger.error("unhandled error exception while getting lesson");
        logger.error(lessonReject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getContentByPosition(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getContentByPosition");
    const unitId = parseInt(req.params.unitId);
    const lessonPosition = parseInt(req.params.lessonPosition);
    const contentPosition = parseInt(req.params.contentPosition);
    logger.debug(`received request: get content #${contentPosition} for unit ${unitId}, lesson #${lessonPosition}`);
    CourseData.getLessonByPosition(unitId, lessonPosition)
      .then((lesson) => {
        if (lesson === undefined) {
          logger.debug(`no lesson found in position ${lessonPosition} for unit ${unitId}`);
          return res
            .status(404)
            .describe(`lesson ${lessonPosition} does not exist in unit ${unitId}`)
            .send();
        }
        CourseData.getContentByPosition(lesson.id, contentPosition)
          .then((content) => {
            if (content === undefined) {
              logger.debug(`no content found in position ${contentPosition} for lesson ${lessonPosition} unit ${unitId}`);
              return res
                .status(404)
                .describe(`no content found in position ${contentPosition} for lesson ${lessonPosition} unit ${unitId}`)
                .send();
            }
            return res.send(content);
          })
          .catch((contentReject) => {
            logger.error("unhandled exception occurred while getting content");
            logger.error(contentReject);
            res.status(500).describe("unknown server error occurred").send();
          });
      })
      .catch((lessonReject) => {
        logger.error("unhandled exception occurred while getting lesson");
        logger.error(lessonReject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

  static getLessonMetadataByPosition(req: Request, rawRes: Response) {
    const res = new ApiResponse(rawRes);
    const logger = CourseController.fileLogger
      .createFunctionLogger("getLessonMetadataByPosition");
    const unitId = parseInt(req.params.unitId);
    const lessonPosition = parseInt(req.params.lessonPosition);
    logger.debug(`received request: get metadata for lesson ${lessonPosition} in unit ${unitId}`);
    CourseData.getLessonByPosition(unitId, lessonPosition)
      .then((lesson) => {
        if (lesson === undefined) {
          logger.debug(`no lesson found in position ${lessonPosition} for unit ${unitId}`);
          return res
            .status(404)
            .describe(`no lesson found in position ${lessonPosition} unit ${unitId}`)
            .send();
        }
        return res.send(lesson);
      })
      .catch((reject) => {
        logger.error("unhandled exception occurred");
        logger.error(reject);
        res.status(500).describe("unknown server error occurred").send();
      });
  }

}