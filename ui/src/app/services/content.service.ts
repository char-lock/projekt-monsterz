import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscribable, Subscription } from "rxjs";
import { ApiService } from "./api.service";
import { CourseContent } from "../types/api.types";
import { UserService } from "./user.service";
import { LoggerService } from "./logger.service";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable()
export class ContentService {

  private _questionList: CourseContent[] = [];
  questionList = new BehaviorSubject<CourseContent[]>(this._questionList);

  lessonId: number;
  contentId: number;
  contentPosition = 0;

  private _currentQuestion: CourseContent | undefined = undefined;
  private _questionSubscription: Subscription;
  currentQuestion = new BehaviorSubject<CourseContent | undefined>(this._currentQuestion);

  private _answerList: string[] = [];
  private _listSubscription: Subscription;
  answerList = new BehaviorSubject<string[]>(this._answerList);

  private _userSubscription: Subscription;

  constructor(
    private _api: ApiService,
    private _logger: LoggerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.lessonId = this.userService.getCurrentLessonProgress() + 1;
    this.contentId = this.userService.getCurrentContentId() + 1;

    this._listSubscription = this.questionList.subscribe((change) => {
      const filtered = change.filter(value => value.id === this.lessonId);
      if (filtered.length > 0) {
        this.contentPosition = change.indexOf(filtered[0]);
      } else if (change.length > 0){
        this.contentId = change[0].id;
        this.contentPosition = 0;
      }
      if (this.contentPosition < change.length) {
        this._currentQuestion = change[this.contentPosition];
        this.currentQuestion.next(this._currentQuestion);
      }
    });

    this._questionSubscription = this.currentQuestion.subscribe((change) => {
      if (change) {
        this._answerList = change.other_answers.split(",")
          .filter((_, index) => index < 3)
          .concat([change.correct_answer]);
        this.answerList.next(this._answerList);
      }
    });

    this._userSubscription = this.userService.user.subscribe((change) => {
      if (change) {
        this.contentId = change.progress_content + 1;
        this.lessonId = change.progress_lesson + 1;
        this.updateQuestionList();
      }
    });
  }

  log(func: string, message: string, meta?: any) {
    this._logger.log("content.service", func, message, meta);
  }

  /** 
   * Requests the question list for the current lesson using the API
   * service, and updates the question list once received.
   */
  updateQuestionList() {
    this._api.getContentByLesson(this.lessonId, (content: CourseContent[]) => {
      this.log(
        "updateQuestionList", 
        `received ${content.length} content for lesson id ${this.lessonId}`
      );
      this._questionList = content;
      this.questionList.next(content);
    });
  }

  /** 
   * Shifts to the next content in line and updates the internal service
   * state accordingly.
   */
  nextContent() {
    this.contentPosition++;
    if (this.contentPosition >= this.questionList.value.length) {
      this.log("nextContent", "reached end of available content");
      this.completeLesson();
    } else {
      this._currentQuestion = this._questionList[this.contentPosition];
      this.currentQuestion.next(this._currentQuestion);
    }
  }

  /** 
   * Updates the internal service state and redirects the user to an
   * appropriate ending screen.
   */
  completeLesson() {
    this.contentPosition = -1;
    this.nextLesson();
    this.router.navigate(["/dashboard"], { relativeTo: this.route });
  }

  /** 
   * Shifts to the next content in line and updates the internal service
   * state accordingly.
   */
  nextLesson() {
    // TODO: Implement the nextLesson method.
  }

  /** 
   * Returns whether or not a provided answer matches the current
   * content's correct answer.
   */
  checkAnswer(guess: string) {
    return this._currentQuestion
      ? this._currentQuestion.correct_answer.toLowerCase() === guess.toLowerCase()
      : false;
  }
}