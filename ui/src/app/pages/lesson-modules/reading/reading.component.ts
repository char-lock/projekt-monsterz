import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContentService } from '../../../../app/services/content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class ReadingComponent {

  currentQuestion = this.contentService.currentQuestion.value;
  private subscription: Subscription;
  constructor(
    private contentService: ContentService
  ) {
    this.subscription = this.contentService.currentQuestion.subscribe((change) => {
      this.currentQuestion = change;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {}

  getContent() {
    return this.currentQuestion?.content_detail;
  }

  finishReading() {}

}
