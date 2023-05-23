import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { LoggerService } from '../../services/logger.service';
import { SessionService } from '../../services/session.service';
import { CourseContent } from 'src/app/types/api.types';

@Component({
  selector: 'app-lesson-module',
  templateUrl: './lesson-module.component.html',
  styleUrls: ['./lesson-module.component.scss']
})
export class LessonModuleComponent implements OnInit {

  private get _current(): CourseContent { 
    return this._content.current; 
  }
  
  public get lessonTitle(): string { 
    return this._content.currentLessonDisplay; 
  }

  constructor(
    private _session: SessionService,
    private _router: Router,
    private _content: ContentService,
    private _logger: LoggerService
  ) {
    this._content.currentSubject.subscribe(
      () => this.changeActivityDisplay()); 
  }

  log(func: string, message: string, meta?: any) {
    this._logger.log("lesson-module.component", func, message, meta);
  }

  public ngOnInit(): void {
    if (this._current) this.changeActivityDisplay();
  }

  changeActivityDisplay() {
    const contentDisplay: string[] = [
      '/lesson/reading',
      '/lesson/drag-drop',
      '/lesson/multiple-choice',
      '/lesson/fill-in-the-blank'
    ];
    let route = '/lesson/reading'
    if (this._current.content_type > 1 && this._current.content_type < 4 )
      route = contentDisplay[this._current.content_type];
    this._router.navigate([route], { skipLocationChange: true });
  }

}
