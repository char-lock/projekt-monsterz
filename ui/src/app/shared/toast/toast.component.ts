import { Component, ComponentRef, ApplicationRef } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { Toast } from 'src/app/types/Toast';

@Component({
  selector: 'app-toast',
  template: `
    <div 
    [ngStyle]="toast.style"
    >
    <h5>
      {{ toast.message }}
    </h5>
    </div>
  `,
  styles: [` 
    div {
    }
    `
  ]

})
export class ToastComponent {
  toast: Toast = {};

  toggle: boolean = true;
  constructor(private toaster: ToastService,
  ) {
    this.toaster.getToast().subscribe((change) => {
      this.toast = change;
      if (this.toast) {
        this.setTimer();
      }
    })
  }

  setTimer() {
    setTimeout(() => {
      this.toggle = false;
      this.toaster.hide();
    }, 4000);

  }
}
