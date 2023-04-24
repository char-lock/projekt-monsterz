import { NewCourseLesson, NewCourseUnit } from "src/endpoints/course/course.types";
import CourseData from "../endpoints/course/course.data";
import ApiLogger from '../shared/logger';

const logger = new ApiLogger("db.course.init");

logger.info("Adding course data to database ...");

const unit: NewCourseUnit = {
  title: "Booleans",
  description: "Help the monsters by learning all about booleans",
  lesson_count: 10
};

const lessons_1: NewCourseLesson[] = [];
for (let i = 0; i < 10; i++) {}