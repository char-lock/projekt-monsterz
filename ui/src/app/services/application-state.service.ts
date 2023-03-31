import { Injectable } from "@angular/core"

@Injectable()
export class ApplicationStateService {

  private loginModalState: number;

  constructor() {
    this.loginModalState = 0;
  }

  GetLoginModalState() {
    return this.loginModalState;
  }

  SetLoginModalState(state: number) {
    if (state < 0) {
      this.loginModalState = 0;
    } else if (state > 2) {
      this.loginModalState = 2;
    } else {
      this.loginModalState = state;
    }
  }

}
