import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppController } from '../../../../app/services/app.controller';

import { ContentService } from '../../../../app/services/content.service';
import { UserSessionService } from '../../../../app/services/user-session.service';
import { UserService } from '../../../../app/services/user.service';

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class ReadingComponent {
  currentQuestion = this.contentService.getCurrentQuestion();
  constructor(
    private userSession: UserSessionService,
    private router: Router,
    private user: UserService,
    private appController: AppController,
    private contentService: ContentService) {
    this.contentService.returnQuestion().subscribe((change) => {
      this.currentQuestion = change;
    })
  }

  getContent() {
    return this.currentQuestion.content_detail;
  }

  finishReading() {
    this.appController.finishReading();
  }
}
