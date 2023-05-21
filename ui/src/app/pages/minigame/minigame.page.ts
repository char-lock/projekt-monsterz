import { Component, Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { LoggerService } from "src/app/services/logger.service";

@Component({
  selector: "pm-minigame-page",
  templateUrl: "./minigame.page.html"
})
export class MinigamePage {

  constructor(private _logger: LoggerService) {}

  // Internal variable with the raw, untransformed prompt.
  private _promptTemplate = ""
  /** Current prompt to display on the minigame page. */
  public prompt = "";

  /** 
   * Logs a message to the console from the minigame page. 
   * 
   * @param func Function from which the message originates
   * 
   * @param message Content of the log
   * 
   * @param meta (Optional) Any additional data to add to the log
   */
  private log(func: string, message: string, meta?: any): void {
    this._logger.log("minigame.page", func, message, meta);
  }

  /**
   * Updates the `prompt` using the currently set `_promptTemplate`
   * and returns the resulting `prompt`.
   */
  private _updatePrompt(): string {
    let inputId = 0;
    this.prompt = this._promptTemplate
      .replace(
        "[ ]", 
        `<input id="minigame-input-${inputId++}"`
        + `placeholder="Write your answer here ..." />`
      );
    return this.prompt;
  }



}
