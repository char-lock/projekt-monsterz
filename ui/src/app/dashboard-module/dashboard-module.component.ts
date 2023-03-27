import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DashBoardModuleModel } from '../models/module-model';

@Component({
  selector: 'app-dashboard-module',
  template: '<div [innerHtml] = "safeHtml"></div>',
  styleUrls: ['./dashboard-module.component.css']
})
export class DashboardModuleComponent {
  constructor(private sanitizer: DomSanitizer) { }
  @Input() currentModule: DashBoardModuleModel = {
    title: '',
    optionalAssetURI: '',
    content: ''
  };
  safeHtml: SafeHtml = {
  };
  ngOnInit() {
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.currentModule.title +
      this.currentModule.optionalAssetURI +
      this.currentModule.content
    )
}
}
