import { Component, EventEmitter, Input, Output } from "@angular/core";
import { timer } from "rxjs";
import { LoggerService } from "src/app/services/logger.service";

/** 
 * A generic toast component. Typically created using the toast service. 
 * 
 * @class FangToastComponent
 */
@Component({
  selector: "fang-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"]
})
export class FangToastComponent {

  /** Severity level of the toast message. Affects the appearance. */
  @Input() level: "success" | "warning" | "failure" | "normal" = "normal";

  /** A short description of the message. */
  @Input() title: string = "";

  /** Message to display inside of the toast. */
  @Input() message: string = "";

  constructor(private _logger: LoggerService) {}

  /** Logs a message to the console as the toast component. */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("toast.component", func, message, meta);
  }

  /** 
   * Triggers the emitter with a signal to close the toast. 
   * 
   * @param delay - length of time to delay in milliseconds
   */
  public close(delay?: number) {
    if (delay) {
      timer(delay).subscribe((_) => this.closed.next());
    } else {
      this.closed.next();
    }
  }

  /** Emits a signal when the toast component should be closed. */
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

}
