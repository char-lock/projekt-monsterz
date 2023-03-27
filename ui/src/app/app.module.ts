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
import { DashboardModuleComponent } from './dashboard-module/dashboard-module.component';
import { ModuleService } from './services/module-service';
import { AlertComponent } from './alert/alert.component';
@NgModule({
  declarations: [
    
    AppComponent,
    LoginScreenComponent,
    HeaderComponent,
    WelcomePageComponent,
    DashboardComponent,
    DashboardModuleComponent,
    DashboardComponent,
    AlertComponent,
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
         ModuleService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
