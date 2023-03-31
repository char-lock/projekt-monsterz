import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from "./app-routing.module";

import { LoggerService } from "./services/logger.service";
import { UserSessionService } from "./services/user-session.service";
import { CookieController } from "./services/cookie.service";
import { EmailValidationService } from './services/email-validation.service';
import { UserRegistrationService } from './services/user-registration.service';
import { ModuleService } from './services/module-service';

import { AppComponent } from './app.component';
import { LoginScreenComponent } from './shared/login-screen/login-screen.component';
import { HeaderComponent } from './shared/header/header.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardModuleComponent } from './pages/dashboard/dashboard-module/dashboard-module.component';
import { ApiService } from './services/api.service';
import { ApplicationStateService } from './services/application-state.service';

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
    AppRoutingModule
  ],
  providers: [
    UserRegistrationService,
    UserSessionService,
    LoggerService,
    EmailValidationService,
    CookieController,
    ModuleService,
    ApiService,
    ApplicationStateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
