import { ɵparseCookieValue } from '@angular/common';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { Logger } from './services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CookieService]
})
export class AppComponent {
  constructor(private logger: Logger) {} 
  
  title ='projekt-monsterz-front'
  loginClick = false;
  clickedOutsideVar = false;
  clickOutside($event: any) {
    if ($event.target.closest('app-login-screen') == null && this.loginClick == true && $event.srcElement && $event.srcElement.classList.contains('openmenu') == false) {
      this.loginClick = !this.loginClick;
    }
 }
  changeContent() {
      this.loginClick = !this.loginClick;
      this.logger.makeLog("App component", "Login Click Value Switched To: " + this.loginClick)
   }
  setStyle() {
    // console.log("Set Style Called!")
    if (this.loginClick == false) {
      return {'filter' : 'blur(0px)'};
    }
    return {'filter' : 'blur(2px)'};

  }

  
}
