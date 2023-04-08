import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from "./app-routing.module";

import { LoggerService } from "./services/logger.service";
import { UserSessionService } from "./services/user-session.service";
import { CookieController } from "./services/cookie.service";
import { ValidationService } from './services/validation.service';
import { UserRegistrationService } from './services/user-registration.service';

import { AppComponent } from './app.component';
import { LoginScreenComponent } from './shared/login-screen/login-screen.component';
import { HeaderComponent } from './shared/header/header.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApiService } from './services/api.service';
import { ApplicationStateService } from './services/application-state.service';
import { LeaderboardService } from './services/leaderboard.service';

import { MonsterCageBackgroundDirective } from './directives/monster-cage-background.directive';
import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';
import { AppController } from './services/app.controller';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    HeaderComponent,
    WelcomePageComponent,
    DashboardComponent,
    MonsterCageBackgroundDirective
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
    ValidationService,
    CookieController,
    ApiService,
    ApplicationStateService,
    LeaderboardService,
    LoginService,
    UserService,
    AppController
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
