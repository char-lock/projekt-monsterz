type User = {
  userId: number;
  username: string;
  createdOn: number;
};

type UserValidation = {
  userId: number;
  validated: boolean;
  validatedOn: number;
  validationMethod: number;
  validationValue: string;
};

type UserAuth = {
  userId: number;
  authKey: string;
};

type UserProgress = {
  userId: number;
  currentLessonId: number;
  lessonPosition: number;
};

type Unit = {
  unitId: number;
  unitName: string;
  unitDesc: string;
  totalLessons: number;
};

type Lesson = {
  lessonId: number;
  unitId: number;
  lessonName: string;
  lessonDesc: string;
  totalContent: number;
};

type LessonContent = {
  contentId: number;
  lessonId: number;
  lessonPosition: number;
  contentType: number;
  contentTitle: string;
  contentFiller: string;
  correctAnswer: string;
};
