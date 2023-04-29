import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRouterModule } from "./router.module";

import { LoggerService } from "./services/logger.service";
import { SessionService } from "./services/session.service";
import { CookieService } from "./services/cookie.service";
import { ValidationService } from './services/validation.service';
import { ToastService } from './services/toast.service';
import { ApiService } from './services/api.service';
import { ContentService } from './services/content.service';
import { LeaderboardService } from './services/leaderboard.service';
import { ModalService } from './services/modal.service';

import { AppComponent } from './app.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LessonModuleComponent } from './pages/lesson-modules/lesson-module.component';
import { DragDropComponent } from './pages/lesson-modules/drag-drop/drag-drop.component';
import { MutlipleChoiceComponent } from './pages/lesson-modules/mutliple-choice/mutliple-choice.component';
import { ReadingComponent } from './pages/lesson-modules/reading/reading.component';
import { FillInTheBlankComponent } from './pages/lesson-modules/fill-in-the-blank/fill-in-the-blank.component';

import { MonsterCageBackgroundDirective } from './directives/monster-cage-background.directive';

/** 
 * A module that contains the primary application imports and
 * definitions.
 */
@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    DashboardComponent,
    MonsterCageBackgroundDirective,
    LessonModuleComponent,
    DragDropComponent,
    MutlipleChoiceComponent,
    ReadingComponent,
    FillInTheBlankComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRouterModule
  ],
  providers: [
    LoggerService,
    ValidationService,
    CookieService,
    ApiService,
    LeaderboardService,
    ContentService,
    ToastService,
    SessionService,
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
