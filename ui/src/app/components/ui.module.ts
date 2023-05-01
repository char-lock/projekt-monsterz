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
import { FangModule } from "../resources/fang-ui/ngx-fang.module";

@NgModule({
  declarations: [
    CardComponent,
    FangModalComponent,
    NavbarComponent,
    LoginModal,
    FangModalContentDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule,
    FangModule
  ],
  exports: [
    CardComponent,
    FangModalComponent,
    NavbarComponent,
    LoginModal
  ]
})
export class UserInterfaceModule {}
