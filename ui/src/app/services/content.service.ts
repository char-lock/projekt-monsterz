import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
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
   * (Read-only)
   * A list containing the content relevant to the current user's
   * current lesson.
   */
  get content(): CourseContent[] {
    return this._content;
  }

  private _contentSubject = new BehaviorSubject<CourseContent[]>(
    this._content);
  /**
   * (Read-only)
   * An observable subject that emits the value of content whenever
   * the list is updated with new content.
   */
  get contentSubject(): BehaviorSubject<CourseContent[]> {
    return this._contentSubject;
  }

  // Internal variables to track the current user's current position
  // within the course.
  private _unitId = 0;
  private _lessonId = 0;
  private _contentId = 0;
  private _lessonPosition = 0;
  private _contentPosition = 0;
  private _lessonTitle = "";

  /**
   * (Read-only)
   * The text to display the current lesson's name
   */
  get currentLessonDisplay(): string {
    return `Lesson ${this._unitId}-${this._lessonPosition}: ${this._lessonTitle}`;
  }

  /** 
   * (Read-only)
   * The current content data based upon the user's progress. 
   */
  get current(): CourseContent {
    if (
      this._content === undefined
      || this._content.length === 0
      || this._contentPosition < 0 
      || this._contentPosition > this._content.length
    ) {
      return {
        id: -1,
        lesson_id: -1,
        position: -1,
        content_type: 0,
        content_detail: '',
        correct_answer: '',
        other_answers: '1,2,3,4'
      };
    }
    return this._content[this._contentPosition];
  }
  
  private _currentSubject = new BehaviorSubject<CourseContent | undefined>(
    this.current);
  /** 
   * (Read-only)
   * An observable subject that emits the current content data whenever
   * the user's progress changes.
   */
  get currentSubject(): BehaviorSubject<CourseContent | undefined> {
    return this._currentSubject;
  }

  private _answers: string[] = [];
  /**
   * (Read-only) 
   * A list of answers, if any, for the current content. 
   */
  get answers(): string[] {
    return this._answers;
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
        if (this._lessonId < 1) this._lessonId = 1;
        this._contentId = change.progress_content;
        if (this._contentId < 1) this._contentId = 1;
        _api.getLessonById(this._lessonId, (lesson) => {
          this._unitId = lesson.unit_id;
          this._lessonPosition = lesson.position;
          this._lessonTitle = lesson.title;
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
        this._lessonTitle = "";
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

  /**
   * Writes a log message to the console from the content service.
   * 
   * @param func Function from which the log originates
   * 
   * @param message Content of the log
   * 
   * @param meta Any additional data or information to log
   */
  private log(func: string, message: string, meta?: any) {
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
  public nextContent() {
    if (this._content !== undefined && this._content.length === 0) return this._updateContent();
    this._contentPosition++;
    if (this._contentPosition >= this._content.length) {
      this.log("nextContent", "reached end of available content");
      this._completeLesson();
    } else {
      this._currentSubject.next(this.current);
    }
  }

  /** 
   * Updates the internal service state and redirects the user to an
   * appropriate ending screen.
   */
  private _completeLesson() {
    this._nextLesson();
  }

  /** 
   * Shifts to the next content in line and updates the internal service
   * state accordingly.
   */
  private _nextLesson() {
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
   * 
   * @param guess Answer to check agains the current correct answer
   */
  public checkAnswer(guess: string) {
    return this.current
      ? this.current.correct_answer.toLowerCase() === guess.toLowerCase()
      : false;
  }

}
