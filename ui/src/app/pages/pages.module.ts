import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { UserInterfaceModule } from "../components/ui.module";

import { LessonModuleComponent } from "./lesson-modules/lesson-module.component";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";
import { SuccessMessageComponent } from "./success-message/success-message.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomePage } from "./home/home.page";
import { MinigamePage } from "./minigame/minigame.page";
import { SafeHtmlPipe } from "./safeHtml.pipe";

@NgModule({
  declarations: [
    LessonModuleComponent,
    WelcomePageComponent,
    SuccessMessageComponent,
    DashboardComponent,
    HomePage,
    MinigamePage,
    SafeHtmlPipe
  ],
  imports: [
    UserInterfaceModule,
    CommonModule,
    RouterModule
  ],
  exports: [
    LessonModuleComponent,
    WelcomePageComponent,
    SuccessMessageComponent,
    DashboardComponent,
    HomePage,
    MinigamePage,
    SafeHtmlPipe
  ]
})
export class PagesModule {}
