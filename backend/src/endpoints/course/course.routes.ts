import { Router } from "express";

import CourseController from "./course.controller";

const router = Router();

// GET unit metadata
router.get("/units/:unitId([0-9+])", CourseController.getUnitMetadataById);

// GET all lesson IDs in unit
router.get("/units/:unitId([0-9+])/lessons", CourseController.getLessonIdsInUnit);

// GET lesson metadata
// By ID
router.get("/lessons/:lessonId([0-9+])", CourseController.getLessonMetadataById);
// By Unit # and Lesson #
router.get(
  "units/:unitId/lessons/:lessonPosition([0-9+])",
  CourseController.getLessonMetadataByPosition
);

// POST unit
router.post("/units", CourseController.createUnit);

// POST lesson
router.post("/lessons", CourseController.createLesson);

// POST content
router.post("/content", CourseController.createContent);

// POST content completion
router.post("/content/:contentId/completion", CourseController.postCompletionOfContent);

// GET content
// By content ID
router.get("/content/:contentId", CourseController.getContentById);
// By lesson
router.get(
  "/units/:unitId([0-9+])/lessons/:lessonPosition([0-9+])/content",
  CourseController.getAllContentByLessonPosition
);
router.get(
  "/lessons/:lessonId([0-9+])/content",
  CourseController.getAllContentByLesson
)
// By position in lesson
router.get(
  "/units/:unitId([0-9+])/lessons/:lessonPosition([0-9+])/content/:contentPosition([0-9+])",
  CourseController.getContentByPosition
);

router.delete("/content/:contentId([0-9+])/deleteContentById", CourseController.deleteLessonByContentId);

export default router;