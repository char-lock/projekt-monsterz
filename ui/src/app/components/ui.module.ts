import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { AppRouterModule } from "../router.module";

import { CardComponent } from "./card/card.component";
import { ButtonComponent } from "./button/button.component";
import { FangInputComponent } from "./input/input.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ModalComponent } from "./modal/modal.component";
import { ModalDirective } from "./modal/modal.directive";
import { LoginModal } from "./modal/content/login/login.modal";

@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    FangInputComponent,
    ModalComponent,
    NavbarComponent,
    LoginModal,
    ModalDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    FangInputComponent,
    ModalComponent,
    NavbarComponent,
    LoginModal
  ]
})
export class UserInterfaceModule {}
