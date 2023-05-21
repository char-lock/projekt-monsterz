import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component";
import { LessonModuleComponent } from "./pages/lesson-modules/lesson-module.component";
import { MultipleChoiceComponent } from "./pages/lesson-modules/mutliple-choice/multiple-choice.component";
import { DragDropComponent } from "./pages/lesson-modules/drag-drop/drag-drop.component";
import { ReadingComponent } from "./pages/lesson-modules/reading/reading.component";
import { FillInTheBlankComponent } from "./pages/lesson-modules/fill-in-the-blank/fill-in-the-blank.component";
import { SuccessMessageComponent } from "./pages/success-message/success-message.component";
import { HomePage } from "./pages/home/home.page";
import { MinigamePage } from "./pages/minigame/minigame.page";

const routes: Routes = [
  { path: "", component: HomePage },
  { path: "dashboard", component: DashboardComponent },
  {
    path: "lesson", component: LessonModuleComponent,
    children: [
      { path: "multiple-choice", component: MultipleChoiceComponent },
      { path: "drag-drop", component: DragDropComponent },
      { path: "reading", component: ReadingComponent },
      { path: "fill-in-the-blank", component: FillInTheBlankComponent },
    ]
  },
  { path: "success-message", component: SuccessMessageComponent},
  { path: "minigame", component: MinigamePage },
  { path: '**', redirectTo: "", pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule {}
