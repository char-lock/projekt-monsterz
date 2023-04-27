import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { ApiService } from "./api.service";

import { CourseContent } from "../types/api.types";
import { UserService } from "./user.service";
import { LoggerService } from "./logger.service";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable()
export class ContentService {

  questionList: CourseContent[] = [];
  lessonId = this.userService.getCurrentLessonProgress() + 1;
  contentId: number;
  contentPosition = 0;

  private currentQuestionObserve: BehaviorSubject<CourseContent>;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private logger: LoggerService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.userService.getCurrentLessonProgressObservable().subscribe((value) => {
      this.lessonId = value + 1;
    });
    this.contentId = this.userService.getCurrentContentId();
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
    this.currentQuestionObserve = new BehaviorSubject<CourseContent>(this.questionList[this.contentPosition]);
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

  getAnswerList() {
    return this.getCurrentQuestion().other_answers.split(",").filter((answer) => {
      return this.getCurrentQuestion().other_answers.split(",").indexOf(answer) < 3;
    }).concat(this.getCurrentQuestion().correct_answer);
  }

  completeLesson() {
    this.questionList = [];
    this.contentPosition = 0;
    this.userService.updateLessonProgress();
    this.updateQuestionList();
    this.router.navigate(["../success-message"]);
  }
  
  checkForCorrectAnswer(value: string) {
    return this.getCurrentQuestion().correct_answer.toLowerCase() === value.toLowerCase();
  }

  returnQuestion() {
    return this.currentQuestionObserve;
  }

}