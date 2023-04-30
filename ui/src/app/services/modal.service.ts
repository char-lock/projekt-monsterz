import { ApplicationRef, createComponent, ComponentRef, EnvironmentInjector, Injectable } from "@angular/core";
import { LoggerService } from "./logger.service";
import { ModalComponent } from "../components/modal/modal.component";
import { LoginModal } from "../components/modal/content/login/login.modal";

/** 
 * A service that manages the display of modals throughout the
 * application.
 * 
 * @class ModalService
 */
@Injectable()
export class ModalService {

  private _content: { [key: string]: any } = {
    "login": LoginModal
  };

  private _modalRef: ComponentRef<ModalComponent> | undefined;

  constructor(
    private _app: ApplicationRef,
    private _injector: EnvironmentInjector,
    private _logger: LoggerService
  ) {}

  /** Writes a log to the console from the ModalService. */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("modal.service", func, message, meta);
  }

  /** Creates a modal with the specified content. */
  create(selector: string) {
    if (!Object.keys(this._content).includes(selector)) { 
      return this.log("create", `requested invalid modal selector "${selector}"`); 
    }
    if (this._modalRef !== undefined) {
      return this.log("create", "a modal is already open");
    }
    this.log("create", `creating and displaying ${selector} modal ...`);
    const modal = document.createElement("pm-modal");
    this._modalRef = createComponent(ModalComponent, {
      environmentInjector: this._injector,
      hostElement: modal
    });
    if (this._modalRef) {
      this._app.attachView(this._modalRef.hostView);
      this._modalRef.instance.content = this._content[selector];
      this._modalRef.instance.closed.subscribe(() => {
        this.log("create", "received close signal");
        document.body.removeChild(modal);
        if (this._modalRef) {
          this._app.detachView(this._modalRef.hostView);
          this._modalRef = undefined;
        }
      });
      this._modalRef.instance.content = this._content[selector];
      this._modalRef.instance.loadContent();
      document.body.appendChild(modal);
    }
  }

  /** Changes the selector for the current modal. */
  changeContent(content: string) {
    if (this._modalRef) {
      this.log("changeContent", `changing modal content to ${content} ...`);
      this._modalRef.instance.content = this._content[content];
    }
  }

  /** Emits the signal to close the modal. */
  destroy() {
    if (this._modalRef) this._modalRef.instance.closed.emit();
  }

}
