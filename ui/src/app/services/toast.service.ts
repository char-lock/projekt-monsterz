import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ToastService {
  toast: any = {};
  toastObserve = new BehaviorSubject<any>(this.toast);

  constructor() {}

  createToast(message: string, status: string) {
    this.toast.message = message;
    this.setStyle(status);
    this.toastObserve.next(this.toast);
  }

  stopToast() {
    this.toast = {};
    setTimeout(() => {
    this.toastObserve.next(this.toast);
    }, 3000)
  }

  setStyle(status: string) {
    switch (status.toLowerCase()) {
      case 'informative':
        this.toast.style = {
          'background-color': '#e7f6f8',
          'display': 'block',
        }
        break;
      case 'warning':
        this.toast.style = {
          'background-color': '#faf3d1',
          'display': 'block'

        }
        break;
      case 'error':
        this.toast.style = {
          'background-color': '#f4e3db',
          'display': 'block'

        }
        break;
      case 'success':
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