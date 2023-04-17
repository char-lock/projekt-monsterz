import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component";
import { LessonModuleComponent } from "./pages/lesson-modules/lesson-module.component";

const routes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "lesson", component: LessonModuleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
