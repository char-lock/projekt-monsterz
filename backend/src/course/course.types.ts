export type CourseUnit = {
  id: number;
  title: string;
  description: string;
  lesson_count: number;
};

export type NewCourseUnit = {
  title: string;
  description: string;
  lesson_count: number;
};

export type CourseLesson = {
  id: number;
  unit_id: number;
  position: number;
  title: string;
  description: string;
  content_count: number;
};

export type NewCourseLesson = {
  unit_id: number;
  position: number;
  title: string;
  description: string;
  content_count: number;
};

export enum ContentType {
  READING = 0,
  MULTIPLE_CHOICE,
  FILL_IN
};

export type CourseContent = {
  id: number;
  lesson_id: number;
  position: number;
  content_type: ContentType;
  content_detail: string;
  correct_answer: string;
  other_answers: string;
};

export type NewCourseContent = {
  lesson_id: number;
  position: number;
  content_type: ContentType;
  content_detail: string;
  correct_answer: string;
  other_answers: string[];
};
