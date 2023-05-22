import { 
  ApplicationRef, 
  createComponent, 
  ComponentRef, 
  EnvironmentInjector, 
  Injectable 
} from "@angular/core";
import { LoggerService } from "./logger.service";
import { 
  FangToastComponent 
} from "../components/toast/toast.component";
import { timer } from "rxjs";

/**
 * A service that handles the creation, display, and destruction of
 * toast messages throughout the application.
 * 
 * @class ToasterService
 */
@Injectable()
export class ToasterService {

  // Internal reference to the current toast component.
  private _toastRef: ComponentRef<FangToastComponent> | undefined;

  constructor(
    private _app: ApplicationRef,
    private _injector: EnvironmentInjector,
    private _logger: LoggerService
  ) {}

  /** 
   * Writes a log to the console from the toaster service. 
   * 
   * @param func Name of the function from which the log originates
   * 
   * @param message Content of the log
   * 
   * @param meta (Optional) Any data or information to log
   */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("toast.service", func, message, meta);
  }

  /** 
   * Creates a new toast message and displays it.
   * 
   * @param message Message to display in the toast
   * 
   * @param level Severity of the toast to display
   * 
   * @param closeAfter (Optional) Delay in milliseconds before closing
   * the toast
   * 
   * @param title (Optional) Short description to display at the top
   * of the toast
   */
  public toast(
    message: string, 
    level: "normal" | "success" | "warning" | "failure" = "normal",
    closeAfter: number = 1000, 
    title?: string
  ) {
    if (this._toastRef !== undefined) {
      return this.log(
        "toast", 
        "A toast instance already exists; halting creation ..."
      );
    }
    this.log("toast", "Creating a new toast instance ...");
    const toastEl = this._createToastElement();
    this._toastRef = createComponent(FangToastComponent, {
      environmentInjector: this._injector,
      hostElement: toastEl
    });
    this._app.attachView(this._toastRef.hostView);
    this._toastRef.instance.message = message;
    this._toastRef.instance.level = level;
    if (title) this._toastRef.instance.title = title;
    this._toastRef.instance.closed.subscribe(() => {
      this.log("toast", "received close signal");
      toastEl.animate({ transform: "translateX(100%)" }, { duration: 500, iterations: 1 });
      timer(490).subscribe(() => {
        toastEl.style.setProperty("transform", "translateX(100%)");
        document.body.removeChild(toastEl);
        this._destroy();
      });
    });
    document.body.appendChild(toastEl);
    this._onToastEnter(toastEl);
    if (closeAfter !== -1)
      this._toastRef.instance.close(closeAfter);
  }

  private _createToastElement(): HTMLElement {
    const el = document.createElement("fang-toast");
    const properties: { [key: string]: string } = {
      "height": "fit-content",
      "width": "fit-content",
      "display": "absolute",
      "right": "0",
      "top": "50%",
      "transform": "translateX(100%)",
      "position": "absolute",
      "z-index": "9000"
    };
    Object.keys(properties).forEach((property) => {
      el.style.setProperty(property, properties[property]);
    });
    return el;
  }

  private _onToastEnter(toastEl: HTMLElement) {
    toastEl.animate([{ transform: "translateX(0)" }], { duration: 500, iterations: 1 });
    timer(490).subscribe(() => toastEl.style.setProperty("transform", "translateX(0)"));
  }

  /** 
   * Detaches the current toast instance and clears it from the 
   * service. 
   */
  private _destroy() {
    if (this._toastRef) {
      this._app.detachView(this._toastRef.hostView);
      this._toastRef = undefined;
    }
  }

}
