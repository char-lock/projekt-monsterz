import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppController } from 'src/app/services/app.controller';
import { ContentService } from 'src/app/services/content.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { LessonContent } from 'src/app/types/Content';

@Component({
  selector: 'app-lesson-module',
  templateUrl: './lesson-module.component.html',
  styleUrls: ['./lesson-module.component.css']
})
export class LessonModuleComponent implements OnInit {
  currentQuestions: LessonContent = this.contentService.getCurrentQuestion();
  constructor(private userSession: UserSessionService,
    private router: Router,
    private appController: AppController,
    private contentService: ContentService) {
    }
  ngOnInit(): void {
    this.appController.checkForAuthentication()
  }
  checkForRightAnswer(value: string) {
    this.appController.checkForRightAnswer(value);
    this.currentQuestions = this.contentService.getCurrentQuestion();
  }

}
