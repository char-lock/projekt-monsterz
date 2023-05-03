import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-lesson-module',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class DragDropComponent implements OnInit, OnDestroy {
  selectedAnswer: string = '';

  currentQuestion = this._content.current;
  private subscription: Subscription;

  constructor(
    private _content: ContentService,
    private _session: SessionService,
    private _logger: LoggerService
  ) {
    this.subscription = this._content.currentSubject.subscribe((change) => {
      this.currentQuestion = change;
    })
  }
  
  ngOnInit(): void {
    this._session.isValid();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  getQuestionText() {
    return this.currentQuestion?.content_detail;
  }

  getAnswerSet() {
    return this._content.answers;
  }

  checkForRightAnswerDrag() {
    this._content.checkAnswer(this.selectedAnswer);
    this.clearCurrentDragArea();
  }

  drag($event: any) {
    $event.dataTransfer.clearData();
    $event.dataTransfer.setData("text", $event.target.innerText);
    console.log($event.text);

  }
  
  onDrop($event: any) {
    $event.preventDefault();
    console.log("On Drop Called");
    let data = $event.dataTransfer.getData("text");
    console.log(data);
    if (document.getElementById('answerbox')!.innerHTML != null) {
      document!.getElementById('answerbox')!.innerHTML = data.toString()
    }
    else {
      console.log("An Issue Occured")
    }
    this.selectedAnswer = data;
    console.log(this.selectedAnswer);
  }
  
  allowDrop($event: any) {
    $event.preventDefault();
  }
  
  clearCurrentDragArea() {
    this.selectedAnswer = '';
    document!.getElementById('answerbox')!.innerText = 'Enter the Right Answer Here!';
  }

}
