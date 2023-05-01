import { ApplicationRef, createComponent, ComponentRef, EnvironmentInjector, Injectable } from "@angular/core";
import { LoggerService } from "./logger.service";
import { FangModalComponent } from "../components/modal/modal.component";
import { LoginModal } from "../components/modal/content/login/login.modal";

/** 
 * A service that manages the display of modals throughout the
 * application.
 * 
 * @class ModalService
 */
@Injectable()
export class ModalService {

  private _content: { [key: string]: typeof LoginModal } = {
    "login": LoginModal
  };
  /** Dictionary of available content to display within a modal. */
  get content(): { [key: string]: typeof LoginModal } {
    return this._content;
  }
  set content(_: { [key: string]: typeof LoginModal }) {
    /** This property cannot be set externally. */
  }

  // Internal reference to the current modal; possibly undefined.
  private _modalRef: ComponentRef<FangModalComponent> | undefined;

  constructor(
    private _app: ApplicationRef,
    private _injector: EnvironmentInjector,
    private _logger: LoggerService
  ) {}

  /** Writes a log to the console from the ModalService. */
  private log(func: string, message: string, meta?: any) {
    this._logger.log("modal.service", func, message, meta);
  }

  /** Displays a modal containing the specified content. */
  public show(contentId: string): void {
    if (!Object.keys(this._content).includes(contentId)) {
      return this.log(
        "show", 
        `Requested invalid content "${contentId}" for the modal`
      );
    }
    if (this._modalRef === undefined) {
      this.log("show", "No modal found. Creating ...");
      this._create();
    }
    this.log(
      "show", 
      `Switching content displayed in the modal to "${contentId}"...`
    );
    this._changeContent(contentId);
  }

  /** Emits the signal to close the current modal. */
  public close() {
    if (this._modalRef)
      this._modalRef.instance.closed.emit();
  }

  /** Creates a new modal instance and inserts it into the DOM. */
  private _create(): void {
    if (this._modalRef !== undefined) {
      return this.log(
        "_create", 
        "A modal instance already exists; halting creation ..."
      );
    }
    this.log("_create", "Creating a new modal instance ...");
    const modal = document.createElement("fang-modal");
    this._modalRef = createComponent(FangModalComponent, {
      environmentInjector: this._injector,
      hostElement: modal
    });
    this._app.attachView(this._modalRef.hostView);
    this._modalRef.instance.closed.subscribe(() => {
      this.log("create", "received close signal");
      document.body.removeChild(modal);
      this._destroy();
    });
    document.body.appendChild(modal);
  }

  /** Changes the content displayed within the current modal instance. */
  private _changeContent(contentId: string) {
    if (!Object.keys(this._content).includes(contentId)) {
      return this.log(
        "changeContent", 
        `No content found for ID "${contentId}"; halting ...`
      );
    }
    if (!this._modalRef) this._create();
    if (this._modalRef) {
      this._modalRef.instance.content = this._content[contentId];
      this._modalRef.instance.loadContent();
    }
  }

  /** Detaches the current modal instance and clears it from the service. */
  private _destroy() {
    if (this._modalRef) {
      this._app.detachView(this._modalRef.hostView);
      this._modalRef = undefined;
    }
  }

}
