import { Injectable, OnInit } from "@angular/core";
import { LessonContent } from "../types/Content"
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class ContentService {
     getAllQuestions = true;
     questionList: LessonContent[] = [];
     index = 0;
     private currentQuestionObserve = new BehaviorSubject<LessonContent>(this.questionList[this.index]);

     constructor(private apiService: ApiService) {
          if (this.getAllQuestions) {
               this.questionList = this.getQuestionsForEntireLesson();
          }
          else {
               this.questionList.push(this.getOneLessonContent());
          }
          this.currentQuestionObserve.next(this.questionList[this.index]);
          this.returnQuestion();
     }
     
     getQuestionsForEntireLesson() {
          return this.apiService.GetWholeLessonContent();
     }
     getOneLessonContent() {
          return this.apiService.GetOneLessonContent();
     }
     getCurrentQuestion() {
          return this.questionList[this.index];
     }
     nextActivity() {
          
          this.incrementIndex();
          if (this.index == this.questionList.length) {
               console.log("All Done!")
          }
          else {
          this.currentQuestionObserve.next(this.questionList[this.index]);
          }
     }
     incrementIndex() {
          this.index++;
     }
     checkForCorrectAnswer(value: string) {
               return this.questionList[this.index].correctAnswer == value;          
     }
     returnQuestion() {
          return this.currentQuestionObserve;
     }
}