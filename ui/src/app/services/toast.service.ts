import { Injectable } from "@angular/core";
import { Toast } from "../types/Toast";
import { BehaviorSubject, Observable } from "rxjs";
import { ToastComponent } from "../pages/toast/toast.component";

@Injectable()
export class ToastService {
  toast: Toast = {};
  toastObserve = new BehaviorSubject<Toast>(this.toast);
  constructor() {
  }

  createToast(message: string, status: string) {
    this.toast.message = message;
    this.setStyle(status);
    this.toastObserve.next(this.toast);
  }
  hide() {
    this.toast = {};
    this.toastObserve.next(this.toast);
  }
  setStyle(status: string) {
    switch (status) {
      case 'Informative':
        this.toast.style = {
          'background-color': '#e7f6f8',
          'display': 'block',
        }
        break;
      case 'Warning':
        this.toast.style = {
          'background-color': '#faf3d1',
          'display': 'block'

        }
        break;
      case 'Error':
        this.toast.style = {
          'background-color': '#f4e3db',
          'display': 'block'

        }
        break;
      case 'Success':
        this.toast.style = {
          'background-color': '#ecf3ec',
          'display': 'block'

        }
        break;
      default:
        this.toast.style = {
          'background-color': 'inherit',
          'display': 'block'
        }
        break;
    }
  }
  getToast() {
    return this.toastObserve;
  }
}