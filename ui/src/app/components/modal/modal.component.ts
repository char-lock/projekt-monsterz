import { Component, EventEmitter, ElementRef, HostBinding, Input, Output, ViewChild } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ModalService } from "src/app/services/modal.service";
import { LoggerService } from "src/app/services/logger.service";
import { ModalDirective } from "./modal.directive";
import { LoginModal } from "./content/login/login.modal";
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
  @ViewChild(ModalDirective, { static: true }) modalContent!: ModalDirective;

  private _content: any;
  @Input()
  get content() { return this._content; }
  set content(value: any) {
    this._content = value;
    this.state = "opened";
  }

  constructor(
    private _logger: LoggerService
  ) {}

  loadContent() {
    if (!this._content) return;
    const vcRef = this.modalContent.viewContainerRef;
    vcRef.clear();
    vcRef.createComponent<any>(this._content);
  }

  close() {
    console.log("emitting close from modal");
    this.closed.next();
  }

  @Output() closed = new EventEmitter<void>();

}
