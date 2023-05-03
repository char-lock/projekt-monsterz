import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class MultipleChoiceComponent {

  public current = this._content.current;
  public answers = this._content.answers;

  constructor(private _content: ContentService) {
    this._content.currentSubject.subscribe((change) => {
      if (change) {
        this.current = change;
        this.answers = this._content.answers;
      }
    });
  }

  /** Compares the user's guess with the actual correct answer. */
  public checkGuess(guess: string) {
    const correct = this._content.checkAnswer(guess);
    if (correct) this._content.nextContent();
  }

}
