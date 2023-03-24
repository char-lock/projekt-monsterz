import { Component, Input } from '@angular/core';
import { DashBoardModuleModel } from '../models/module-model';

@Component({
  selector: 'app-dashboard-module',
  templateUrl: './dashboard-module.component.html',
  styleUrls: ['./dashboard-module.component.css']
})
export class DashboardModuleComponent {
  @Input() currentModule: DashBoardModuleModel = {
    title: '',
    optionalAssetURI: '',
    content: ''
  };
}
