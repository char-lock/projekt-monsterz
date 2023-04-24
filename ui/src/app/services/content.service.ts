import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { ApiService } from "./api.service";

import { CourseContent } from "../types/api.types";
import { UserService } from "./user.service";
import { LoggerService } from "./logger.service";

@Injectable()
export class ContentService {
  
  questionList: CourseContent[] = [];
  lessonId: number;
  contentId: number;
  contentPosition = 0;
  
  private currentQuestionObserve: BehaviorSubject<CourseContent>;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private logger: LoggerService
  ) {
    this.lessonId = this.userService.getCurrentLessonProgress();
    this.contentId = this.userService.getCurrentContentId();
    if (this.userService.getUser() === undefined)
    this.updateQuestionList();
    this.currentQuestionObserve = new BehaviorSubject<CourseContent>(this.questionList[this.contentPosition]);
  }

  /** 
   * Requests the list of questions for the current lesson according to
   * the currently set lesson ID and sets the question list accordingly.
   */
  updateQuestionList() {
    this.apiService.getContentByLesson(this.lessonId)
      .then((result) => {
        if (result.length === 0) {
          return this.logger.makeLog(
            "content.service::updateQuestionList", 
            `no questions found for lesson id ${this.lessonId}`
          );
        }
        this.questionList = result;
        this.updateIdOrPosition();
      })
      .catch((reject) => {
        this.logger.makeLog(
          "content.service::updateQuestionList", 
          `unable to update questions for lesson id ${this.lessonId} - reason: ${reject}`
        );
      });
  }

  /** 
   * If the current content ID is in the question list, updates the position to its index.
   * otherwise updates content ID to the ID for question in position 0.
   */
  updateIdOrPosition() {
    const content = this.questionList.filter(value => value.id === this.contentId);
    if (content.length > 0) {
      this.contentPosition = this.questionList.indexOf(content[0]);
    } else {
      this.contentId = this.questionList[0].id;
    }
  }
  
  getCurrentQuestion() {
    return this.questionList[this.contentPosition];
  }
  
  nextActivity() {
    this.contentPosition++;
    if (this.contentPosition >= this.questionList.length) {
      this.logger.makeLog("content.service::nextActivity", "reached end of available content");
      this.completeLesson();
    } else {
      this.currentQuestionObserve.next(this.questionList[this.contentPosition]);
    }
  }
  
  completeLesson() {}

  checkForCorrectAnswer(value: string) {
    return this.getCurrentQuestion().correct_answer.toLowerCase() === value.toLowerCase();          
  }
  
  returnQuestion() {
    return this.currentQuestionObserve;
  }

}