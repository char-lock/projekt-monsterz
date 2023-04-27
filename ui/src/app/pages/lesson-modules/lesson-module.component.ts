import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AppController } from 'src/app/services/app.controller';
import { ContentService } from 'src/app/services/content.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { UserService } from 'src/app/services/user.service';
import { LessonContent } from 'src/app/types/Content';
import { ContentType } from 'src/app/types/api.types';
@Component({
  selector: 'app-lesson-module',
  templateUrl: './lesson-module.component.html',
  styleUrls: ['./lesson-module.component.css']
})
export class LessonModuleComponent implements OnInit {
  currentProgress: number = 0;
  selectedAnswer: string = '';

  currentQuestion = this.contentService.getCurrentQuestion();

  contentType: number = this.currentQuestion.content_type;
  constructor(private userSession: UserSessionService,
    private router: Router,
    private user: UserService,
    private appController: AppController,
    private contentService: ContentService,
    private route: ActivatedRoute) {


    this.contentService.returnQuestion().subscribe((change) => {
      this.contentType = change.content_type;
      this.navigateToCorrectLesson();
    })
  }

  ngOnInit(): void {
    this.appController.checkForAuthentication();
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
