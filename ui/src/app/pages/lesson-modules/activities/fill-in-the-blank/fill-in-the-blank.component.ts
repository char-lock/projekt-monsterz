import { Component } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { CourseActivityComponent } from '../activity.class';

@Component({
  selector: 'app-fill-in-the-blank',
  templateUrl: './fill-in-the-blank.component.html',
  styleUrls: ['../../lesson-module.component.scss']
})
export class FillInTheBlankComponent extends CourseActivityComponent {

  constructor(_content: ContentService) {
    super(_content);
  }

  /** Checks the user's guess and handles the redirect if correct. */
  public onSubmit(guess: string) {
    if (this.checkGuess(guess))
      this.nextActivity();
  }

}
