import { Component, AfterViewInit } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { CourseActivityComponent } from '../activity.class';

@Component({
  selector: 'app-lesson-module',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['../../lesson-module.component.scss']
})
export class DragDropComponent extends CourseActivityComponent implements AfterViewInit {
  
  private _selected: string = "";
  private _dropAnswerEl: HTMLElement | undefined;

  constructor(_content: ContentService) {
    super(_content);
  }

  public ngAfterViewInit(): void {
    this._dropAnswerEl = this._updateDropElement();
  }

  private _updateDropElement(): HTMLElement | undefined {
    const dropEl: HTMLElement | null = document.getElementById('answer-drop');
    if (dropEl !== null) this._dropAnswerEl = dropEl;
    return this._dropAnswerEl;
  }

  private _clearGuess(): void {
    if (this._dropAnswerEl)
      this._dropAnswerEl.innerText = 'Drop answer here!';
    this._selected = '';
  }

  /** Handles activity submission */
  public onSubmit() {
    if (this.checkGuess(this._selected))
      this.nextActivity();
    this._clearGuess();
  }

  /** Handles a user-initiated drag event */
  public onDragStart($event: DragEvent) {
    if ($event.dataTransfer === null || $event.target === null) return;
    $event.dataTransfer.clearData();
    $event.dataTransfer.setData(
      "text",
      (<HTMLElement>$event.target).innerText
    );
  }
  
  public onDrop($event: DragEvent): void {
    $event.preventDefault();
    if ($event.dataTransfer === null || this._dropAnswerEl === undefined) 
      return;
    const data = $event.dataTransfer.getData("text");
    this._dropAnswerEl.innerText = data;
    this._selected = data;
  }
  
  public enableDrop($event: DragEvent) {
    $event.preventDefault();
  }

}
