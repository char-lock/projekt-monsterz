import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppController } from 'src/app/services/app.controller';
import { ContentService } from 'src/app/services/content.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-fill-in-the-blank',
  templateUrl: './fill-in-the-blank.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class FillInTheBlankComponent implements OnInit, OnDestroy {
  selectedAnswer: string = '';
  currentQuestion = this.contentService.getCurrentQuestion();
  subscription: Subscription;
  constructor(
    private userSession: UserSessionService,
    private router: Router,
    private user: UserService,
    private appController: AppController,
    private contentService: ContentService) {
    this.subscription = this.contentService.returnQuestion().subscribe((change) => {
      this.currentQuestion = change;
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.appController.checkForAuthentication();
  }
  getQuestionText() {
    return this.currentQuestion.content_detail;
  }
  checkForRightAnswer(value: string) {
    this.appController.checkForRightAnswer(value);
  }
}
