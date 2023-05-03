import { Component } from '@angular/core';

import { 
  ContentService 
} from '../../../../app/services/content.service';

/** 
 * A display for course content that is intended to be read. 
 * 
 * @class ReadingComponent
 */
@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['../lesson-module.component.css']
})
export class ReadingComponent {

  public current = this._content.current;

  constructor(private _content: ContentService) {
    // A subscription to the content service to update the content
    // to display.
    this._content.currentSubject.subscribe((change) => {
      if (change) this.current = change;
    });
  }

  /** Handles when the user finishes reading the current content. */
  public finish() {
    this._content.nextContent();
  }

}
