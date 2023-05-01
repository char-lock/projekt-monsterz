import { Component, EventEmitter, HostBinding, Input, Output, ViewChild } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { LoggerService } from "src/app/services/logger.service";
import { FangModalContentDirective } from "./modal.directive";

/** 
 * A generic modal component, typically created with the modal service. 
 * 
 * @class FangModalComponent
 */
@Component({
  selector: "fang-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
  animations: [
    trigger("state", [
      state("opened", style({ display: "flex" })),
      state("closed, void", style({ display: "none" })),
      transition("* => *", animate("80ms ease-in"))
    ])
  ]
})
export class FangModalComponent {

  /** Current state of the modal. Used to trigger animations. */
  @HostBinding("@state") state: "opened" | "closed" = "closed";
  /** Defines the directive to which to bind the modal's content. */
  @ViewChild(FangModalContentDirective, { static: true })
  modalContent!: FangModalContentDirective;

  private _content: any;
  /** Class for the component to display within the modal. */
  @Input()
  get content() { return this._content; }
  set content(value: any) {
    this._content = value;
    this.state = "opened";
  }

  constructor(private _logger: LoggerService) {}

  /** Logs a message to the console from the modal component. */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("modal.component", func, message, meta);
  }

  /** Refreshes the container and loads the currently set content. */
  public loadContent() {
    if (!this._content) return;
    const vcRef = this.modalContent.viewContainerRef;
    vcRef.clear();
    vcRef.createComponent<any>(this._content);
  }

  /** Emits a signal to close the modal. */
  public close() {
    this.log("close", "Sending signal to close the modal ...");
    this.closed.next();
  }

  /** Emits a signal whenever the modal needs to be closed. */
  @Output() closed = new EventEmitter<void>();

}
