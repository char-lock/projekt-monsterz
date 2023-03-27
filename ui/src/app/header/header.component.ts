import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieController } from '../services/cookie.service';
import { Logger } from '../services/logger.service';
import { LogInService } from '../services/login-user-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  @Output() newContentChangeEvent = new EventEmitter<string>();
  currentLogIn: boolean = false;
  
  
  constructor(private logger: Logger,
    private loginService: LogInService,
    private cookieService: CookieController) {
  }
  ngOnInit() {
    this.loginService.currentLoginStatus.subscribe(value =>
    this.currentLogIn = value
  );

  }
  sendEmitterToLogin(value: string) {
    this.newContentChangeEvent.emit(value);
    this.logger.makeLog("Header Component", "Send Emitter to open login form")
    console.log(this.currentLogIn);
  }



}
