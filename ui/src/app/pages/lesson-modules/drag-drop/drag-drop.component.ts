import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppController } from 'src/app/services/app.controller';
import { ContentService } from 'src/app/services/content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lesson-module',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class DragDropComponent implements OnInit, OnDestroy {
  selectedAnswer: string = '';
  currentQuestion = this.contentService.getCurrentQuestion();
  subscription: Subscription;
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
  getQuestionText() {
    return this.currentQuestion.content_detail;
  }

  getAnswerSet() {
    return this.contentService.getAnswerList();
  }

  checkForRightAnswerDrag() {
    this.appController.checkForRightAnswer(this.selectedAnswer);
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
