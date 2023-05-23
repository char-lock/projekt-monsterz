import { Component } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { CourseActivityComponent } from '../activity.class';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['../../lesson-module.component.scss']
})
export class MultipleChoiceComponent extends CourseActivityComponent {

  constructor(_content: ContentService) {
    super(_content);
  }

  public onSubmit(guess: string) {
    if (this.checkGuess(guess))
      this.nextActivity();
  }

}
