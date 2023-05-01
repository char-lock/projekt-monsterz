import { NgModule } from "@angular/core";
import { FangButtonComponent } from "./components/fang-button/button.component";
import { FangInputComponent } from "./components/fang-input/input.component";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    FangButtonComponent,
    FangInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    FangButtonComponent,
    FangInputComponent
  ]
})
export class FangModule {}
