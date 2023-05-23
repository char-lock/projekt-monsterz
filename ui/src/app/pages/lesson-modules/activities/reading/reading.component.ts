import { Component } from '@angular/core';
import { CourseActivityComponent } from '../activity.class';
import { ContentService } from '../../../../services/content.service';

/** 
 * A display for course content that is intended to be read. 
 * 
 * @class ReadingComponent
 */
@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['../../lesson-module.component.scss']
})
export class ReadingComponent extends CourseActivityComponent {

  constructor(_content: ContentService) {
    super(_content);
  }

  /** Handles when the user finishes reading the current content. */
  public finish(): void {
    this.nextActivity();
  }

}
