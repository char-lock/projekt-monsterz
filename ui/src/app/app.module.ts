import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { HeaderComponent } from './header/header.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

import { Logger } from './services/logger.service';
import { AccountService } from './services/account-service.service';
import { EmailValidate } from './services/email-validation.service';
import { CreateUserService } from './services/create-user-service.service';
import { CookieController } from './services/cookie.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogInService } from './services/login-user-service.service';
import { AlertComponent } from './alert/alert.component';
import { appBackground } from './directives/monster-cage-background-directive';
@NgModule({
  declarations: [
    
    AppComponent,
    LoginScreenComponent,
    HeaderComponent,
    WelcomePageComponent,
    DashboardComponent,
    AlertComponent,
    appBackground,
  ],
  imports: [
    BrowserModule,
    CommonModule,
  ],
  providers: [CreateUserService,
         AccountService,
         Logger,
         EmailValidate,
         CookieController,
         LogInService,
         
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
