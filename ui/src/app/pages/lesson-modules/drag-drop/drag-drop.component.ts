import { Component, Input } from '@angular/core';
import { LessonModuleComponent } from '../lesson-module.component';
import { Router } from '@angular/router';
import { AppController } from 'src/app/services/app.controller';
import { ContentService } from 'src/app/services/content.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { UserService } from 'src/app/services/user.service';
import { LessonContent } from 'src/app/types/Content';
@Component({
  selector: 'app-lesson-module',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class DragDropComponent {
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

  getQuestionText() {
    return this.currentQuestion.content_detail;
  }

  getAnswerSet() {
    return this.currentQuestion.other_answers.split(",")
      .concat([this.currentQuestion.correct_answer]);
  }

  checkForRightAnswerDrag() {
    this.appController.checkForRightAnswer(this.selectedAnswer);
    this.clearCurrentDragArea();
  }

  drag($event: any) {

    //Add to container on dra
    //Future directive.
    // ("text", $event.target.id);
    $event.dataTransfer.setData("text", $event.target.innerText);
    console.log($event.text);

  }
  onDrop($event: any) {
    $event.preventDefault();
    console.log("On Drop Called");
    let data = $event.dataTransfer.getData("text"); //Returning null.
    document!.getElementById('answerbox')!.innerHTML = data.toString() //Works fine as it's null.
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
