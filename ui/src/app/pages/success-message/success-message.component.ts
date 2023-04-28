import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppController } from 'src/app/services/app.controller';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.css']
})
export class SuccessMessageComponent implements OnInit {
  constructor(private appController: AppController,
    private router: Router) {
  }
  ngOnInit(): void {
    this.appController.checkForAuthentication();
  }
  goToDashBoard() {
    this.router.navigate(["../dashboard"]);
  }
  goToNextLesson() {
    this.router.navigate(["../lesson"]);
  }
}
