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
         width: 250px; 
         padding: 6px 8px 8px; 
         text-align: center;
    }
    `
  ]

})
export class ToastComponent {
  toast: Toast = {};
  constructor(private toaster: ToastService,
  ) {
    this.toaster.getToast().subscribe((change) => {
      this.toast = change
    });
  }
}
