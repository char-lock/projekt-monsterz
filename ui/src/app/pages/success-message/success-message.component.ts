import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.css']
})
export class SuccessMessageComponent implements OnInit {
  
  constructor(
    private _session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._session.isValid();
  }
  
  goToDashBoard() {
    this.router.navigate(["../dashboard"]);
  }
  
  goToNextLesson() {
    this.router.navigate(["../lesson"]);
  }

}
