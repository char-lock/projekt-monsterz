import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  currentQuestion: LessonContent = this.contentService.getCurrentQuestion();

  constructor(private userSession: UserSessionService,
    private router: Router,
    private user: UserService,
    private appController: AppController,
    private contentService: ContentService) {

      this.user.getCurrentLessonProgressObservable().subscribe((change) => {
        this.currentProgress = change;
      })
      
      this.contentService.returnQuestion().subscribe((change) => {
        this.currentQuestion = change;
      })
    }
  ngOnInit(): void {
    this.appController.checkForAuthentication()
  }
  checkForRightAnswer(value: string) {
    this.appController.checkForRightAnswer(value);
  }
}
