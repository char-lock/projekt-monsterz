import { Component } from "@angular/core";
import { ContentService } from "src/app/services/content.service";
import { CourseContent } from "src/app/types/api.types";

export class CourseActivityComponent {
  
  // Read-only. Internal getter for the current content.
  private get _current(): CourseContent {
    return this._content.current;
  }

  // Read-only. Internal getter for the correct answer.
  private get _correct(): string {
    return this._current.correct_answer;
  }

  /**
   * (Read-only)
   * Details for the current content
   */
  public get details(): string {
    return this._current.content_detail;
  }

  private _answers: string[] = [];
  /**
   * (Read-only)
   * A list of four answers, one of which is correct.
   */
  public get answers(): string[] {
    if (this._answers.length === 0)
      this._answers = this._shuffle(this._current.other_answers
        .split(',').filter((_, i) => i < 3).concat(this._correct));
    return this._answers; 
  }

  constructor(private _content: ContentService) {}

  /** Shuffles a list of strings and returns the shuffled list. */
  private _shuffle(x: string[]): string[] {
    let _unpicked = x;
    const _r: string[] = [];
    while (_unpicked.length > 0) {
      const _i = Math.floor(Math.random() * _unpicked.length);
      _r.push(_unpicked[_i]);
      _unpicked = _unpicked.filter((_, i) => i !== _i);
    }
    return _r;
  }

  /** 
   * Returns whether or not the provided guess matches the known
   * correct answer.
   */
  public checkGuess(guess: string): boolean {
    return guess.toLowerCase() === this._correct.toLowerCase();
  }

  public nextActivity(): void {
    this._content.nextContent();
  }

}
