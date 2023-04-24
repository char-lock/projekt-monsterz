export type ApiResponse = {
  statusCode: number,
  statusShortDesc: string,
  statusLongDesc: string,
  data?: any
};

export enum UserType {
  GUEST = -1,
  INDIVIDUAL = 0,
  STUDENT = 1,
  EDUCATOR = 2,
  SUPPORT = 99
};

export enum ValidationMethod {
  UNKNOWN = -1,
  EMAIL = 0,
  EDUCATION_CODE = 1
};

export type User = {
  id: number;
  username: string;
  user_type: UserType;
  created_on: string;
  validated: boolean;
  validated_on: string;
  validation_method: ValidationMethod;
  validation_value: string;
  progress_lesson: number;
  progress_content: number;
};

export type NewUser = {
  username: string;
  password: string;
  validation_method: number;
  validation_value: string;
};

export type CourseUnit = {
  id: number;
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
