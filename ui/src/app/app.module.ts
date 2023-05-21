import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AppRouterModule } from "./router.module";
import { UserInterfaceModule } from './components/ui.module';
import { PagesModule } from './pages/pages.module';

import { LoggerService } from "./services/logger.service";
import { SessionService } from "./services/session.service";
import { CookieService } from "./services/cookie.service";
import { ToasterService } from './services/toaster.service';
import { ApiService } from './services/api.service';
import { ContentService } from './services/content.service';
import { LeaderboardService } from './services/leaderboard.service';
import { ModalService } from './services/modal.service';

import { AppComponent } from './app.component';
import { DragDropComponent } from './pages/lesson-modules/drag-drop/drag-drop.component';
import { MultipleChoiceComponent } from './pages/lesson-modules/mutliple-choice/multiple-choice.component';
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
    MonsterCageBackgroundDirective,
    DragDropComponent,
    MultipleChoiceComponent,
    ReadingComponent,
    FillInTheBlankComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRouterModule,
    UserInterfaceModule,
    PagesModule
  ],
  providers: [
    LoggerService,
    CookieService,
    ApiService,
    LeaderboardService,
    ContentService,
    ToasterService,
    SessionService,
    ModalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
