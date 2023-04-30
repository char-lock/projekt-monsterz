import { Component, Input } from "@angular/core";

@Component({
  selector: "pm-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.css"]
})
export class ButtonComponent {
  @Input() clickHandler = () => {};
  @Input() backgroundColour = "var(--colour-primary)";
}