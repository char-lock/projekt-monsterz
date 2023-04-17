import { Injectable, OnInit } from "@angular/core";
import { LessonContent } from "../types/Content"
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";

@Injectable()
export class ContentService {
     getAllQuestions = true;
     questionList: LessonContent[] = [];
     index = 0;
     
     
     constructor(private apiService: ApiService) {
          if (this.getAllQuestions) {
               this.questionList = this.apiService.GetWholeLessonContent();
          }
          else {
               this.questionList.push(this.apiService.GetOneLessonContent());
          }
          
     }


     getQuestionsForEntireLesson() {
          this.questionList = this.apiService.GetWholeLessonContent();
     }
     
     getCurrentQuestion() {
          return this.questionList[this.index];
     }
     nextActivity() {
          this.incrementIndex();
     }
     incrementIndex() {
          this.index++;
     }
     checkForCorrectAnswer(value: string) {
               return this.questionList[this.index].correctAnswer == value;          
     }
     returnQuestion() {
          return this.questionList[this.index];
     }
}