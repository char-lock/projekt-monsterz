import { ɵparseCookieValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { Account } from './models/account-model';
import { AccountService } from './services/account-service.service';
import { Logger } from './services/logger.service';
import { LogInService } from './services/login-user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CookieService]
})
export class AppComponent implements OnInit{
  constructor(private logger: Logger,
    private cookieService: CookieService,
    private accountService: AccountService,
    private loginService: LogInService) {} 
  ngOnInit(): void {
    this.loginService.checkForExistingLoginSession();
    this.loginService.currentLoginStatus.subscribe(value => this.loggedIn = value)
  }
  
  title ='projekt-monsterz-front'
  loginClick: boolean = false;
  loggedIn: boolean =  false;
  clickedOutsideVar = false;
  clickOutside($event: any) {
    if ($event.target.closest('app-login-screen') == null && this.loginClick == true && $event.srcElement && $event.srcElement.classList.contains('openmenu') == false) {
      this.loginClick = !this.loginClick;
    }
 }
  changeContent() {
      this.loginClick = !this.loginClick;
      this.logger.makeLog("App component", "Login Click Value Switched To: " + this.loginClick.valueOf())
   }
  setStyle() {
    // console.log("Set Style Called!")
    if (this.loginClick == false) {
      return {'filter' : 'blur(0px)'};
    }
    return {'filter' : 'blur(2px)'};

  }

  
}
