import { NewCourseContent, NewCourseLesson, NewCourseUnit } from "../endpoints/course/course.types";
import CourseData from "../endpoints/course/course.data";
import ApiLogger from '../shared/logger';

const logger = new ApiLogger("db.course.init");

logger.info("Adding course data to database ...");

const unit: NewCourseUnit = {
  title: "Booleans",
  description: "Help the monsters by learning all about booleans",
  lesson_count: 10
};

CourseData.addUnit(unit)
  .then((newUnit) => {
    const lessons: NewCourseLesson[] = [];
    for (let i = 0; i < 10; i++ ) {
      lessons.push({
        unit_id: newUnit.id,
        position: i + 1,
        title: `Lesson ${newUnit.id}-${i + 1}`,
        description: `Description data for lesson ${i + 1} in unit ${newUnit.id} goes here.`,
        content_count: 10
      });
    }
    lessons.forEach((lesson) => {
      CourseData.addLesson(lesson)
        .then((newLesson) => {
          const contents: NewCourseContent[] = [];
          for (let k = 0; k < 10; k++) {
            contents.push({
              lesson_id: newLesson.id,
              position: k + 1,
              content_type: k % 4,
              content_detail: `Detailed content or question for content #${k + 1} in lesson ${newUnit.id}-${lesson.position}`,
              correct_answer: "correct",
              other_answers: [
                `incorrect 1 for ${newUnit.id}-${newLesson.position}-${k + 1}`,
                `incorrect 2 for ${newUnit.id}-${newLesson.position}-${k + 1}`,
                `incorrect 3 for ${newUnit.id}-${newLesson.position}-${k + 1}`,
                `incorrect 4 for ${newUnit.id}-${newLesson.position}-${k + 1}`
              ].join(","),
              complete: false
            });
          }
          contents.forEach((content) => {
            CourseData.addContent(content);
          })
        })
    })
  });
