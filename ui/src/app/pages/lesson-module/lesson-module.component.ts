import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppController } from 'src/app/services/app.controller';
import { QuestionService } from 'src/app/services/question.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { Question } from 'src/app/types/Question';

@Component({
  selector: 'app-lesson-module',
  templateUrl: './lesson-module.component.html',
  styleUrls: ['./lesson-module.component.css']
})
export class LessonModuleComponent implements OnInit {
  currentQuestions: Question = this.questionService.getQuestions();
  constructor(private userSession: UserSessionService,
    private router: Router,
    private questionService: QuestionService,
    private appController: AppController) {
      this.questionService.returnQuestion().subscribe((value) => {
        this.currentQuestions = value;
      })
    }
  ngOnInit(): void {
    this.appController.checkForAuthentication()
  }
  checkForRightAnswer(value: string) {
    this.appController.checkForRightAnswer(value);
  }

}
