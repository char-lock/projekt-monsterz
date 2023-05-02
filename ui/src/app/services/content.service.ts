import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { ApiService } from "./api.service";
import { CourseContent } from "../types/api.types";
import { LoggerService } from "./logger.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionService } from "./session.service";
import { User } from "../types/api.types";

/**
 * A service that handles the fetching, display, and progression of
 * course content for the application.
 * 
 * @class ContentService
 */
@Injectable()
export class ContentService {

  private _content: CourseContent[] = [];
  /** 
   * A list containing the content relevant to the current user's
   * current lesson.
   */
  get content(): CourseContent[] {
    return this._content;
  }
  set content(_: CourseContent[]) { 
    /** This property is not settable externally. */ 
  }

  private _contentSubject = new BehaviorSubject<CourseContent[]>(
    this._content);
  /**
   * An observable subject that emits the value of content whenever
   * the list is updated with new content.
   */
  get contentSubject(): BehaviorSubject<CourseContent[]> {
    return this._contentSubject;
  }
  set contentSubject(_: BehaviorSubject<CourseContent[]>) { 
    /** This property is not settable externally. */
  }

  // Internal variables to track the current user's current position
  // within the course.
  private _unitId = 0;
  private _lessonId = 0;
  private _contentId = 0;
  private _lessonPosition = 0;
  private _contentPosition = 0;

  /** The current content data based upon the user's progress. */
  get current(): CourseContent | undefined {
    if (
      this._contentPosition < 0 
      || this._contentPosition > this._content.length
    ) {
      return undefined;
    }
    return this._content[this._contentPosition];
  }
  set current(_: CourseContent | undefined) {
    /** This property is not settable externally. */
  }
  
  private _currentSubject = new BehaviorSubject<CourseContent | undefined>(
    this.current);
  /** 
   * An observable subject that emits the current content data whenever
   * the user's progress changes.
   */
  get currentSubject(): BehaviorSubject<CourseContent | undefined> {
    return this._currentSubject;
  }
  set currentSubject(_: BehaviorSubject<CourseContent | undefined>) {
    /** This property is not settable externally. */
  }

  private _answers: string[] = [];
  /** A list of answers, if any, for the current content. */
  get answers(): string[] {
    return this._answers;
  }
  set answers(_: string[]) {
    /** This property is not settable externally. */
  }

  constructor(
    private _api: ApiService,
    private _logger: LoggerService,
    private router: Router,
    private _session: SessionService,
    private route: ActivatedRoute
  ) {
    // Subscribes to the session's current user and updates the progress
    // if a valid session has begun.
    this._session.userSubject.subscribe((change: User | undefined) => {
      if (change) {
        this._lessonId = change.progress_lesson;
        this._contentId = change.progress_content;
        _api.getLessonById(this._lessonId, (lesson) => {
          this._unitId = lesson.unit_id;
          this._lessonPosition = lesson.position;
        });
        _api.getContentById(this._contentId, (response) => {
          this._contentPosition = response.position;
        });
        _api.getContentByLesson(this._lessonId, (allContent) => {
          this._content = allContent;
          this._contentSubject.next(allContent);
        });
      } else {
        this._lessonId = 0;
        this._contentId = 0;
        this._unitId = 0;
        this._lessonPosition = 0;
        this._contentPosition = 0;
        this._content = [];
        this._contentSubject.next([]);
      }
    });
    // Subscribes to the content and updates the current content based
    // upon the data within.
    this._contentSubject.subscribe((change) => {
      if (change.length > 0) {
        this._currentSubject.next(
          this.current 
            ? this.current 
            : this.content[0]
        );
      } else {
        this._currentSubject.next(undefined);
      }
    });
    // Subscribes to the currently selected content and updates the
    // answer list.
    this._currentSubject.subscribe((change) => {
      if (change) {
        const update = change.other_answers.split(",")
          .filter((_, index) => {
            return index < 3;
          })
          .concat(change.correct_answer);
        this._answers = update;
      } else {
        this._answers = [];
      }
    });
  }

  log(func: string, message: string, meta?: any) {
    this._logger.log("content.service", func, message, meta);
  }

  /** Updates the content based upon the currently set lesson ID. */
  private _updateContent() {
    this._api.getLessonById(this._lessonId, (lesson) => {
      this._unitId = lesson.unit_id;
      this._lessonPosition = lesson.position;
      this._api.getContentByLesson(this._lessonId, (response) => {
        this._content = response;
        this._contentSubject.next(response);
      })
    });
  }

  /** 
   * Updates the lesson information based upon the currently set
   * lesson position and unit ID.
   */
  private _updateLesson() {
    this._api.getLessonByPosition(
      this._unitId, 
      this._lessonPosition, 
      (lesson) => {
        this._lessonId = lesson.id;
        this._contentPosition = 0;
        this._updateContent();
      }
    );
  }

  /** 
   * Shifts to the next content in line and updates the internal service
   * state accordingly.
   */
  nextContent() {
    if (this._content.length === 0) return;
    this._contentPosition++;
    if (this._contentPosition >= this._content.length) {
      this.log("nextContent", "reached end of available content");
      this.completeLesson();
    } else {
      this._currentSubject.next(this.current);
    }
  }

  /** 
   * Updates the internal service state and redirects the user to an
   * appropriate ending screen.
   */
  completeLesson() {
    this.nextLesson();
  }

  /** 
   * Shifts to the next content in line and updates the internal service
   * state accordingly.
   */
  nextLesson() {
    this._api.getUnitById(this._unitId, (unit) => {
      if (this._lessonPosition < unit.lesson_count - 1) {
        this._lessonPosition++;
        this._updateLesson();
      } else {
        this.router.navigate(["/dashboard"], { relativeTo: this.route });
      }
    });
  }

  /** 
   * Returns whether or not a provided answer matches the current
   * content's correct answer.
   */
  checkAnswer(guess: string) {
    return this.current
      ? this.current.correct_answer.toLowerCase() === guess.toLowerCase()
      : false;
  }

}
