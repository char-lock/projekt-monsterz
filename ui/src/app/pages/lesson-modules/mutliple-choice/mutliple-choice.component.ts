import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppController } from 'src/app/services/app.controller';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-mutliple-choice',
  templateUrl: './mutliple-choice.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class MutlipleChoiceComponent implements OnInit, OnDestroy{
  selectedAnswer: string = '';
  subscription: Subscription;
  currentQuestion = this.contentService.getCurrentQuestion();
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
