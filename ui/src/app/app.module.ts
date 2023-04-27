import { ComponentRef, NgModule } from '@angular/core';
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
import { LessonModuleComponent } from './pages/lesson-modules/lesson-module.component';
import { ContentService } from './services/content.service';
import { DragDropComponent } from './pages/lesson-modules/drag-drop/drag-drop.component';
import { MutlipleChoiceComponent } from './pages/lesson-modules/mutliple-choice/mutliple-choice.component';
import { ReadingComponent } from './pages/lesson-modules/reading/reading.component';
import { FillInTheBlankComponent } from './pages/lesson-modules/fill-in-the-blank/fill-in-the-blank.component';
import { ToastService } from './services/toast.service';
import { ToastComponent } from './shared/toast/toast.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    HeaderComponent,
    WelcomePageComponent,
    DashboardComponent,
    MonsterCageBackgroundDirective,
    LessonModuleComponent,
    DragDropComponent,
    MutlipleChoiceComponent,
    ReadingComponent,
    FillInTheBlankComponent,
    ToastComponent

  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,

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
    AppController,
    ContentService,
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
