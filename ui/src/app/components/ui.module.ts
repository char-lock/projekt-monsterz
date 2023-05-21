import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { AppRouterModule } from "../router.module";

import { CardComponent } from "./card/card.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FangModalComponent } from "./modal/modal.component";
import { FangModalContentDirective } from "./modal/modal.directive";
import { LoginModal } from "./modal/content/login/login.modal";
import { RegisterModal } from "./modal/content/register/register.modal";
import { FangInputComponent } from "./input/input.component";
import { FangToastComponent } from "./toast/toast.component";

@NgModule({
  declarations: [
    CardComponent,
    FangModalComponent,
    NavbarComponent,
    LoginModal,
    RegisterModal,
    FangModalContentDirective,
    FangToastComponent,
    FangInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule
  ],
  exports: [
    CardComponent,
    FangModalComponent,
    NavbarComponent,
    LoginModal,
    RegisterModal,
    FangToastComponent,
    FangInputComponent
  ]
})
export class UserInterfaceModule {}
