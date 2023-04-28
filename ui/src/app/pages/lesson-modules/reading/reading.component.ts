import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppController } from '../../../../app/services/app.controller';

import { ContentService } from '../../../../app/services/content.service';
import { UserSessionService } from '../../../../app/services/user-session.service';
import { UserService } from '../../../../app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class ReadingComponent implements OnInit, OnDestroy{
  currentQuestion = this.contentService.getCurrentQuestion();
  subscription: Subscription = new Subscription;
  constructor(
    private appController: AppController,
    private contentService: ContentService) {
      this.subscription = this.contentService.returnQuestion().subscribe((change) => {
      this.currentQuestion = change;
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  ngOnInit(): void {
    this.appController.checkForAuthentication();
  }
  getContent() {
    return this.currentQuestion.content_detail;
  }

  finishReading() {
    this.appController.finishReading();
  }
}
