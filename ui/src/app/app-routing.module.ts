import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component";
import { LessonModuleComponent } from "./pages/lesson-modules/lesson-module.component";
import { MutlipleChoiceComponent } from "./pages/lesson-modules/mutliple-choice/mutliple-choice.component";
import { DragDropComponent } from "./pages/lesson-modules/drag-drop/drag-drop.component";
import { ReadingComponent } from "./pages/lesson-modules/reading/reading.component";
import { FillInTheBlankComponent } from "./pages/lesson-modules/fill-in-the-blank/fill-in-the-blank.component";

const routes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "dashboard", component: DashboardComponent },
  {
    path: "lesson", component: LessonModuleComponent,
    children: [
      { path: "multiple-choice", component: MutlipleChoiceComponent },
      { path: "drag-drop", component: DragDropComponent },
      { path: "reading", component: ReadingComponent },
      { path: "fill-in-the-blank", component: FillInTheBlankComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
