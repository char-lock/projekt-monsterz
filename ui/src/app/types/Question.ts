export class Question {
     private correctAnswer: string = ''
     constructor(public question: string,
          public answers: string[]) {
               this.correctAnswer = answers[0];
               this.answers = this.shuffleAnswers(this.answers);
     }
     shuffleAnswers(answers: string[]): string[] {
          //implement shuffle algorithm.
          return this.answers;
     }
     checkForCorrectAnswer(answerRecieved: string) {
          return this.correctAnswer === answerRecieved;
     }
}