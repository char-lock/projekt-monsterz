// import { LessonContent } from "./Content";

// export class Question {
//      currentQuestion: LessonContent = {
//           contentType: 0,
//           contentText: ""
//      }
//      constructor(private correctAnswer: string,
//           private genericAnswers: string[]) {
//                this.currentQuestion.correctAnswer = correctAnswer;
//                this.genericAnswers = this.shuffleAnswers(this.genericAnswers);
//      }

     
//      //Key value pair: Question string.
//      //String for correct answer.
//      //Array of string for different choices.
//      //Send you a decently long answers list ->
//      //Feed
     
//      shuffleAnswers(genericAnswers: string[]): string[] {
//           //implement shuffle algorithm.
//           return this.genericAnswers;
//      }
//      checkForCorrectAnswer(answerRecieved: string) {
//           return this.correctAnswer === answerRecieved;
//      }
// }
// // Glossary vs. definitions