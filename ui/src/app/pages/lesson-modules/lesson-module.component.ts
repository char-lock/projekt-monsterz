import { Component, EventEmitter, OnDestroy, OnInit, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';
import { LoggerService } from 'src/app/services/logger.service';
import { SessionService } from 'src/app/services/session.service';
import { ContentType } from 'src/app/types/api.types';

@Component({
  selector: 'app-lesson-module',
  templateUrl: './lesson-module.component.html',
  styleUrls: ['./lesson-module.component.css']
})
export class LessonModuleComponent implements OnInit, OnDestroy {

  currentProgress: number = 0;
  selectedAnswer: string = '';

  currentQuestion = this.contentService.currentQuestion.value;
  private subscription: Subscription;

  contentType: number = 0;

  constructor(
    private _session: SessionService,
    private router: Router,
    private contentService: ContentService,
    private route: ActivatedRoute,
    private _logger: LoggerService
  ) {
    this.subscription = this.contentService.currentQuestion.subscribe((change) => {
      this.log("constructor", "subscription to current question triggered");
      if (change !== undefined) {
        this.log("constructor", "appropriate change detected");
        this.currentQuestion = change;
        this.contentType = change.content_type;
        this.navigateToCorrectLesson();
      }
    });
  }

  log(func: string, message: string, meta?: any) {
    this._logger.log("lesson-module.component", func, message, meta);
  }

  ngOnInit(): void {
    this._session.isValid();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngAfterViewInit(): void {
    this.contentService.updateQuestionList();
  }

  navigateToCorrectLesson() {
    switch (this.contentType) {
      case ContentType.MULTIPLE_CHOICE:
        this.router.navigate(['/lesson/multiple-choice'], { relativeTo: this.route });
        break;
      case ContentType.DRAG_DROP:
        this.router.navigate(['/lesson/drag-drop'], { relativeTo: this.route });
        break;
      case ContentType.READING:
        this.router.navigate(['/lesson/reading'], { relativeTo: this.route });
        break;
      case ContentType.FILL_IN:
        this.router.navigate(['/lesson/fill-in-the-blank'], { relativeTo: this.route });
        break;
      default:
        this.router.navigate(['/lesson/reading'], { relativeTo: this.route });
        break;
    }
  }

}
