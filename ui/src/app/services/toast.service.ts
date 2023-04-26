import { Injectable } from "@angular/core";
import { Toast } from "../types/Toast";

@Injectable()
export class ToastService {
  toast: Toast = {
    message: "",
    style: {}
  };
  constructor() {
  }

  createToast(message: string, status: string) {
    this.toast.message = message;
    console.log(this.toast.message);
    console.log("Toast message created!");
    this.setStyle(status);
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
    return this.toast;
    console.log("Returning");
    console.log(this.toast);
  }
}