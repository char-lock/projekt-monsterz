import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppController } from 'src/app/services/app.controller';
import { ContentService } from 'src/app/services/content.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { UserService } from 'src/app/services/user.service';
import { LessonContent } from 'src/app/types/Content';

@Component({
  selector: 'app-mutliple-choice',
  templateUrl: './mutliple-choice.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class MutlipleChoiceComponent {
  selectedAnswer: string = '';
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


    getAnswerSet() {
      return this.contentService.getAnswerList();
    }

    getQuestionText() {
      return this.currentQuestion.content_detail;
    }

    checkForRightAnswer(value: string) {
      this.appController.checkForRightAnswer(value);
    }
}
