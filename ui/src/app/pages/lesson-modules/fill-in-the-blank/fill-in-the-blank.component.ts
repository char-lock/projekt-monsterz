import { Component } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-fill-in-the-blank',
  templateUrl: './fill-in-the-blank.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class FillInTheBlankComponent {

  public current = this._content.current;

  constructor(private _content: ContentService) {
    this._content.currentSubject.subscribe((change) => {
      if (change) this.current = change;
    });
  }

  /** Checks the user's guess and handles the redirect if correct. */
  checkAnswer(guess: string) {
    const correct = this._content.checkAnswer(guess);
    if (correct) this._content.nextContent();
  }

}
