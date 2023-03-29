import { DashBoardModuleModel } from '../../models/module-model';
import { Component, OnInit} from '@angular/core';
import { Router } from "@angular/router"
import { ModuleService } from '../../services/module-service';
import { UserSessionService } from '../../services/user-session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  score: number = 15;
  moduleArray: DashBoardModuleModel[] = this.moduleService.getModules();

  constructor(
    private userSession: UserSessionService,
    private moduleService: ModuleService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.userSession.IsAuthenticated()) {
      this.router.navigate([".."]);
    }
  }

  getUsername() {
    return this.userSession.GetCurrentUsername();
  }

  getScore() {
    return this.userSession.GetCurrentScore();
  }

}
