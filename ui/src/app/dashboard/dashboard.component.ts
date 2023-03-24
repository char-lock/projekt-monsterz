import { DashBoardModuleModel } from '../models/module-model';
import { AccountService } from '../services/account-service.service';
import { Component, ElementRef, OnInit} from '@angular/core';
import { ModuleService } from '../services/module-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  score: number = 15;



  constructor(private accountService: AccountService,
    private moduleService: ModuleService){}
  ngOnInit() {
    this.accountService.currentAccountObserve.subscribe((value) => {
      this.username = value.username;
    });  }
    moduleArray: DashBoardModuleModel[] = this.moduleService.getModules();
    


}
