import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { Toast } from 'src/app/types/Toast';

@Component({
  selector: 'app-toast',
  template: `
    <div *ngIf="toggle" 
    [ngStyle]="toast.style"
    toastTimer="toast">
      {{ toast.message }}
    </div>
  `
})
export class ToastComponent {
  toast: Toast;
  toggle: boolean = true;
  constructor(private toaster: ToastService) { 
    this.toast = this.toaster.getToast()
    this.setTimer() 
  }
  setTimer() {
     setTimeout(() => {
          this.toggle = false;
     }, 3000);
  }
}
