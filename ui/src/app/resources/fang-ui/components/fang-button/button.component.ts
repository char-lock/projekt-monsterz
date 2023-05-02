import { Component, Input } from "@angular/core";
import { LoggerService } from "src/app/services/logger.service";
import { ToasterService } from "src/app/services/toaster.service";

/** 
 * A generic button provided by FangUI. 
 * 
 * @class FangButtonComponent
 */
@Component({
  selector: "fang-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.css"]
})
export class FangButtonComponent {

  /** A function that runs upon clicking the button. */
  @Input() onClick = () => {};
 
  /** The desired colour for the button to use as its primary background. */
  @Input() backgroundColour: string = "var(--colour-primary)";

  /** Size of the button represented as a percentage of the original. */
  @Input() scale: number = 1;

  constructor(private _logger: LoggerService, private _toaster: ToasterService) {}

}