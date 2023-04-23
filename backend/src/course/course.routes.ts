import { Router } from "express";

import CourseController from "./course.controller";

const router = Router();

// GET unit metadata
router.get("/units/:unitId", CourseController.getUnitMetadataById);

// GET all lesson IDs in unit
router.get("units/:unitId/lessons", CourseController.getLessonIdsInUnit);

// GET lesson metadata
// By ID
router.get("lessons/:lessonId", CourseController.getLessonMetadataById);
// By Unit # and Lesson #
router.get(
  "units/:unitId/lessons/:lessonPosition",
  CourseController.getLessonMetadataByPosition
);

// GET content
// By content ID
router.get("content/:contentId", CourseController.getContentById);
// By lesson
router.get(
  "units/:unitId/lessons/:lessonPosition/content",
  CourseController.getAllContentByLesson
);
// By position in lesson
router.get(
  "units/:unitId/lessons/:lessonPosition/content/:contentPosition",
  CourseController.getContentByPosition
);

export default router;