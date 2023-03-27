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
  progress: number = 15;
  score: number = 200;



  constructor(private accountService: AccountService,
    private moduleService: ModuleService){}
  ngOnInit() {
    this.accountService.currentAccountObserve.subscribe((value) => {
    });  }
    moduleArray: DashBoardModuleModel[] = this.moduleService.getModules();
    setProgressBar() {
      let styles = {
        // 'background': 'linear-gradient(90deg, green 15%, black 85%)',
        'background': 
        'linear-gradient(90deg, darkgreen ' + 0 + '% ' + (this.progress) + '%, black ' + (this.progress) + '% 100%)'        
      }
        return styles;
       
    }
  }
