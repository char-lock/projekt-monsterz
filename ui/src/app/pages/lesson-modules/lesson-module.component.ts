import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AppController } from 'src/app/services/app.controller';
import { ContentService } from 'src/app/services/content.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { UserService } from 'src/app/services/user.service';
import { LessonContent } from 'src/app/types/Content';
@Component({
  selector: 'app-lesson-module',
  templateUrl: './lesson-module.component.html',
  styleUrls: ['./lesson-module.component.css']
})
export class LessonModuleComponent implements OnInit {
  currentProgress: number = 0;
  selectedAnswer: string = '';  
  
  currentQuestion: LessonContent = this.contentService.getCurrentQuestion();
  
  contentType: number = this.currentQuestion.contentType;
  constructor(private userSession: UserSessionService,
    private router: Router,
    private user: UserService,
    private appController: AppController,
    private contentService: ContentService,
    private route: ActivatedRoute) {

    this.user.getCurrentLessonProgressObservable().subscribe((change) => {
      this.currentProgress = change;
    })
    this.contentService.returnQuestion().subscribe((change) => {
      this.contentType = change.contentType;
      this.navigateToCorrectLesson();
    })
  }
  ngOnInit(): void {
    this.appController.checkForAuthentication();
  }
  navigateToCorrectLesson() {
    switch (this.contentType) {
      case 1:
        this.router.navigate(['/lesson/multiple-choice'], { relativeTo: this.route });
        break;
      case 2:
        this.router.navigate(['/lesson/drag-drop'], { relativeTo: this.route });
        break;
      case 3:
        this.router.navigate(['/lesson/reading'], { relativeTo: this.route });
        break;
      case 4:
        this.router.navigate(['/lesson/fill-in-the-blank'],{ relativeTo: this.route });
        break;
    }
  }
}
