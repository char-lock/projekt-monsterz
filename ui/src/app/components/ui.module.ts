import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { CardComponent } from "./card/card.component";
import { ButtonComponent } from "./button/button.component";
import { InputComponent } from "./input/input.component";

@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    InputComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    InputComponent
  ]
})
export class UserInterfaceModule {}
