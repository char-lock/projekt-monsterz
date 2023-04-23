import { Injectable } from "@angular/core"
import { LoggerService } from "./logger.service";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ApplicationStateService {
  private loginModalState = 0;
  private loginModal = new BehaviorSubject<number>(0)
  constructor(private logger: LoggerService) {
    this.loginModalState = 0;
  }
  GetLoginModalState() {
    return this.loginModalState;
  }
  SetLoginModalState(state: number) {
    this.logger.makeLog("Application State Service", "Set Login State Modal")
    if (state < 0) {
      this.loginModal.next(0);
      this.logger.makeLog("application-state.service::SetLoginModalState", "0");
    } else if (state > 2) {
      this.loginModal.next(2);
      this.logger.makeLog("application-state.service::SetLoginModalState", "0");
    } else {
      this.loginModalState = state;
      this.loginModal.next(this.loginModalState);
    }
  }
  getModalState() {
    return this.loginModal;
  }
}
