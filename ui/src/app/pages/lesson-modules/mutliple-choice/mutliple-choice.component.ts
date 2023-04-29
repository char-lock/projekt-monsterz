import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-mutliple-choice',
  templateUrl: './mutliple-choice.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class MutlipleChoiceComponent implements OnInit, OnDestroy {

  selectedAnswer: string = '';
  currentQuestion = this.contentService.currentQuestion.value;
  private subscription: Subscription;

  constructor(
    private contentService: ContentService) {
    this.subscription = this.contentService.currentQuestion.subscribe((change) => {
      this.currentQuestion = change;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
  }
  getAnswerSet() {
    return this.contentService.answerList.value;
  }

  getQuestionText() {
    return this.currentQuestion?.content_detail;
  }

  checkForRightAnswer(value: string) {
  }

}
