import { Injectable, OnInit } from "@angular/core";
import { Question } from "../types/Question";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class QuestionService{
     index = 0;
     currentTestQuestions = [
          new Question("How old are you?", ["12", "13", "14", "15"]),
          new Question("How many fingers am I holding up?", ["1", "4", "2", "1"]),
          new Question("What is your name?", ["Joe", "Hillary", "Naruto", "Grimjow"])
     ]
     currentQuestion = new BehaviorSubject<Question>(this.currentTestQuestions[this.index]);
     questionLength = this.currentTestQuestions.length;
     setQuestions() {
          //Get Questions for whole lesson.
     }
     getQuestions() {
          return this.currentTestQuestions[this.index];
     }
     nextQuestion() {
          this.incrementIndex();
          this.currentQuestion.next(this.currentTestQuestions[this.index]);
     }
     incrementIndex() {
          this.index++;
     }
     checkForCorrectAnswer(value: string) {
          return this.currentTestQuestions[this.index].checkForCorrectAnswer(value);
     }
     returnQuestion() {
          return this.currentQuestion;
     }



}