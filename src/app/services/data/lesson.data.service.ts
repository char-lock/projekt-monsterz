import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LessonDataService {
  
  CreateUnit(unit: object) {}

  CreateLesson(lesson: object) {}

  CreateLessonContent(content: object) {}

  GetLessonById(lessonId: number) {}

  GetLessonIdByUnitId(unitId: number, which: number = -1) {}

  GetLessonContentById(contentId: number) {}

  GetLessonContentByLessonId(lessonId: number, which: number = -1) {}

  GetUnitById(unitId: number) {}

  DeleteUnitById(unitId: number) {}

  DeleteLessonById(lessonId: number) {}

  DeleteLessonContentById(contentId: number) {}

}
