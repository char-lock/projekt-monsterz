import { Component, EventEmitter, ElementRef, HostBinding, Input, Output, ViewChild } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ModalService } from "src/app/services/modal.service";
import { LoggerService } from "src/app/services/logger.service";


@Component({
  selector: "pm-modal",
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
export class ModalComponent {

  @HostBinding("@state") state: "opened" | "closed" = "closed";

  private _content = "";
  @Input()
  get content() { return this._content; }
  set content(value: string) {
    this._content = value;
  }

  constructor(
    private _logger: LoggerService
  ) {}

  @Output() closed = new EventEmitter<void>();

}
